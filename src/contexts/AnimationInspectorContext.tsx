import type { Animation, Group, NumberPropConfig, PropConfig } from '@/types/animation'
import {
  collectSweepGroups,
  runLinearSweep,
  runSteppedSweep,
  type PerAnimationValues,
} from '@/contexts/animateSweep'
import {
  loadPersistedOverrides,
  persistOverrides,
  PERSIST_DEBOUNCE_MS,
} from '@/contexts/inspectorPersistence'
import { buildPropDefaults } from '@/contexts/inspectorPropDefaults'
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Context,
  type ReactNode,
} from 'react'

type PropOverridesByAnimationId = Record<string, Record<string, unknown>>
type ReplayVersionsByAnimationId = Record<string, number>
type AnimateToggles = Record<string, Record<string, 'fixed' | 'animate'>>

interface AnimationInspectorContextValue {
  selectedAnimationId?: string
  selectedAnimation?: Animation
  selectAnimation: (animation: Animation) => void
  clearSelection: () => void
  isSelected: (animationId: string) => boolean
  getPropOverrides: (animationId: string, propsConfig?: PropConfig[]) => Record<string, unknown>
  setPropOverride: (
    animationId: string,
    propsConfig: PropConfig[] | undefined,
    name: string,
    value: unknown
  ) => void
  resetPropOverrides: (animationId: string, propsConfig?: PropConfig[]) => void
  getReplayVersion: (animationId: string) => number
  replayAnimation: (animationId: string) => void
  getAnimateMode: (
    animationId: string,
    propName: string,
    defaultMode?: 'fixed' | 'animate'
  ) => 'fixed' | 'animate'
  setAnimateMode: (animationId: string, propName: string, mode: 'fixed' | 'animate') => void
}

// Preserve context identity across Vite HMR to prevent provider/consumer mismatch.
// When Vite re-evaluates this module during HMR, createContext() would produce a new
// object, breaking the provider↔consumer link until both re-render. Stashing the
// original context in import.meta.hot.data keeps the identity stable.
const hmrData = import.meta.hot?.data as Record<string, unknown> | undefined
const AnimationInspectorContext: Context<AnimationInspectorContextValue | undefined> =
  (hmrData?.inspectorContext as Context<AnimationInspectorContextValue | undefined>) ??
  createContext<AnimationInspectorContextValue | undefined>(undefined)

if (hmrData) {
  hmrData.inspectorContext = AnimationInspectorContext
}

// ── Re-exports for external consumers ──────────────────────────────────────
export { buildPropDefaults, hasDirtyPropOverrides } from '@/contexts/inspectorPropDefaults'

// ── Overrides & Replay ─────────────────────────────────────────────────────

/** Manages per-animation prop overrides and replay version counters. Persists overrides to localStorage. */
function useOverridesAndReplay() {
  const [overridesByAnimationId, setOverridesByAnimationId] =
    useState<PropOverridesByAnimationId>(loadPersistedOverrides)
  const [replayVersionsByAnimationId, setReplayVersionsByAnimationId] =
    useState<ReplayVersionsByAnimationId>({})

  // Debounced persistence — ref-based timer survives re-renders
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isInitialMountRef = useRef(true)

  useEffect(() => {
    // Skip writing back the value we just loaded on mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }
    clearTimeout(persistTimerRef.current)
    persistTimerRef.current = setTimeout(() => {
      persistOverrides(overridesByAnimationId)
    }, PERSIST_DEBOUNCE_MS)
    return () => clearTimeout(persistTimerRef.current)
  }, [overridesByAnimationId])

  const ensureOverrides = useCallback((animationId: string, propsConfig?: PropConfig[]) => {
    const defaults = buildPropDefaults(propsConfig, animationId)
    setOverridesByAnimationId((prev) =>
      prev[animationId] != null ? prev : { ...prev, [animationId]: defaults }
    )
    return defaults
  }, [])

  const getPropOverrides = useCallback(
    (animationId: string, propsConfig?: PropConfig[]) =>
      overridesByAnimationId[animationId] ?? buildPropDefaults(propsConfig, animationId),
    [overridesByAnimationId]
  )

  const setPropOverride = useCallback(
    (animationId: string, propsConfig: PropConfig[] | undefined, name: string, value: unknown) => {
      setOverridesByAnimationId((prev) => ({
        ...prev,
        [animationId]: {
          ...(prev[animationId] ?? buildPropDefaults(propsConfig, animationId)),
          [name]: value,
        },
      }))
    },
    []
  )

  const resetPropOverrides = useCallback((animationId: string, _propsConfig?: PropConfig[]) => {
    setOverridesByAnimationId((prev) => {
      const next = { ...prev }
      delete next[animationId]
      return next
    })
  }, [])

  const getReplayVersion = useCallback(
    (animationId: string) => replayVersionsByAnimationId[animationId] ?? 0,
    [replayVersionsByAnimationId]
  )

  const replayAnimation = useCallback((animationId: string) => {
    setReplayVersionsByAnimationId((prev) => ({
      ...prev,
      [animationId]: (prev[animationId] ?? 0) + 1,
    }))
  }, [])

  return {
    ensureOverrides,
    getPropOverrides,
    setPropOverride,
    resetPropOverrides,
    getReplayVersion,
    replayAnimation,
  }
}

// ── Animate Preview ────────────────────────────────────────────────────────

/** Resolves the effective animate mode for a prop, falling back to the prop's default or 'animate'. */
function resolveAnimateMode(
  toggles: AnimateToggles,
  animationId: string,
  propName: string,
  defaultMode?: 'fixed' | 'animate'
): 'fixed' | 'animate' {
  return toggles[animationId]?.[propName] ?? defaultMode ?? 'animate'
}

/** Finds animatable number props that are currently in 'animate' mode. */
function getActiveAnimatableProps(
  props: PropConfig[] | undefined,
  toggles: AnimateToggles,
  animationId: string
): NumberPropConfig[] {
  if (!props) return []
  return props.filter((p): p is NumberPropConfig => {
    if (p.type !== 'number' || !p.animatable) return false
    return resolveAnimateMode(toggles, animationId, p.name, p.animateDefault) === 'animate'
  })
}

/** Manages the Fixed/Animate toggle state and per-config sweep timers for all cards in the group. */
function useAnimatePreview(animations: Animation[] | undefined) {
  const [animateToggles, setAnimateToggles] = useState<AnimateToggles>({})
  const [animatedValues, setAnimatedValues] = useState<PerAnimationValues>({})

  const getAnimateMode = useCallback(
    (animationId: string, propName: string, defaultMode?: 'fixed' | 'animate') =>
      resolveAnimateMode(animateToggles, animationId, propName, defaultMode),
    [animateToggles]
  )

  const setAnimateMode = useCallback(
    (animationId: string, propName: string, mode: 'fixed' | 'animate') => {
      setAnimateToggles((prev) => ({
        ...prev,
        [animationId]: { ...(prev[animationId] ?? {}), [propName]: mode },
      }))
    },
    []
  )

  // Group animations by sweep config; one timer per unique config.
  const sweepGroups = useMemo(() => collectSweepGroups(animations), [animations])

  useEffect(() => {
    if (sweepGroups.size === 0) {
      setAnimatedValues({})
      return
    }

    const emit = (update: PerAnimationValues) => {
      setAnimatedValues((prev) => ({ ...prev, ...update }))
    }

    const cleanups: (() => void)[] = []

    for (const { config, animationIds } of sweepGroups.values()) {
      const runner = config.style === 'linear' ? runLinearSweep : runSteppedSweep
      cleanups.push(runner(config, animationIds, emit))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [sweepGroups])

  return { animateToggles, animatedValues, getAnimateMode, setAnimateMode }
}

/** Injects animated values for any animation whose animatable props are in animate mode. */
function mergeAnimatedOverrides(
  animationId: string,
  baseOverrides: Record<string, unknown>,
  toggles: AnimateToggles,
  values: PerAnimationValues,
  propsConfig?: PropConfig[]
): Record<string, unknown> {
  const active = getActiveAnimatableProps(propsConfig, toggles, animationId)
  if (active.length === 0) return baseOverrides
  const animValues = values[animationId]
  if (!animValues) return baseOverrides
  const merged = { ...baseOverrides }
  for (const prop of active) {
    merged[prop.name] = prop.name in animValues ? animValues[prop.name] : (prop.min ?? 0)
  }
  return merged
}

// ── Provider ───────────────────────────────────────────────────────────────

interface AnimationInspectorProviderProps {
  currentGroup?: Group
  children: ReactNode
}

/**
 * Provides animation inspector state (selection, prop overrides, replay, animate preview)
 * to the component tree.
 */
export function AnimationInspectorProvider({
  currentGroup,
  children,
}: AnimationInspectorProviderProps) {
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | undefined>(undefined)
  const {
    ensureOverrides,
    getPropOverrides: getBaseOverrides,
    setPropOverride,
    resetPropOverrides,
    getReplayVersion,
    replayAnimation,
  } = useOverridesAndReplay()

  useEffect(() => {
    if (selectedAnimationId == null) return
    const stillExists =
      currentGroup?.animations.some((animation) => animation.id === selectedAnimationId) ?? false
    if (!stillExists) {
      setSelectedAnimationId(undefined)
    }
  }, [currentGroup, selectedAnimationId])

  const selectedAnimation = useMemo(
    () => currentGroup?.animations.find((animation) => animation.id === selectedAnimationId),
    [currentGroup, selectedAnimationId]
  )

  const selectAnimation = useCallback(
    (animation: Animation) => {
      setSelectedAnimationId(animation.id)
      ensureOverrides(animation.id, animation.props)
    },
    [ensureOverrides]
  )

  const clearSelection = useCallback(() => setSelectedAnimationId(undefined), [])
  const isSelected = useCallback(
    (animationId: string) => selectedAnimationId === animationId,
    [selectedAnimationId]
  )

  const { animateToggles, animatedValues, getAnimateMode, setAnimateMode } = useAnimatePreview(
    currentGroup?.animations
  )

  const getPropOverrides = useCallback(
    (animationId: string, propsConfig?: PropConfig[]) => {
      const base = getBaseOverrides(animationId, propsConfig)
      return mergeAnimatedOverrides(animationId, base, animateToggles, animatedValues, propsConfig)
    },
    [getBaseOverrides, animateToggles, animatedValues]
  )

  const value = useMemo<AnimationInspectorContextValue>(
    () => ({
      selectedAnimationId,
      selectedAnimation,
      selectAnimation,
      clearSelection,
      isSelected,
      getPropOverrides,
      setPropOverride,
      resetPropOverrides,
      getReplayVersion,
      replayAnimation,
      getAnimateMode,
      setAnimateMode,
    }),
    [
      selectedAnimationId,
      selectedAnimation,
      selectAnimation,
      clearSelection,
      isSelected,
      getPropOverrides,
      setPropOverride,
      resetPropOverrides,
      getReplayVersion,
      replayAnimation,
      getAnimateMode,
      setAnimateMode,
    ]
  )

  return <AnimationInspectorContext value={value}>{children}</AnimationInspectorContext>
}

/** Reads the animation inspector context. Throws if used outside AnimationInspectorProvider. */
export function useAnimationInspector() {
  const context = use(AnimationInspectorContext)

  if (context === undefined) {
    throw new Error('useAnimationInspector must be used within an AnimationInspectorProvider')
  }

  return context
}
