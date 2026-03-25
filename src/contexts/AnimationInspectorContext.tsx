import type { Animation, Group, PropConfig, StyleObjectFieldConfig } from '@/types/animation'
import { getInspectorStarterDefaults } from '@/contexts/inspectorStarterDefaults'
import { resolveColorInputDefault } from '@/utils/colors'
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Context,
  type ReactNode,
} from 'react'

type PropOverridesByAnimationId = Record<string, Record<string, unknown>>
type ReplayVersionsByAnimationId = Record<string, number>

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

function normalizeColorDefault(color: string): string {
  const resolved = resolveColorInputDefault(color)
  return resolved !== '' ? resolved : color
}

function buildStyleFieldDefault(field: StyleObjectFieldConfig): string {
  switch (field.type) {
    case 'color':
      return field.default != null ? normalizeColorDefault(field.default) : ''
    case 'number':
      return field.default != null ? `${field.default}${field.unit ?? ''}` : ''
    case 'string':
      return field.default ?? ''
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cloneDefaultValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return [...value]
  }

  if (isRecord(value)) {
    return { ...value }
  }

  return value
}

/** Builds the inspector's default override record from editable prop metadata. */
export function buildPropDefaults(
  propsConfig?: PropConfig[],
  animationId?: string
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  const starterDefaults = getInspectorStarterDefaults(animationId)

  for (const prop of propsConfig ?? []) {
    if (prop.disabled) continue
    if (prop.type === 'style-object') {
      const styleDefaults = Object.fromEntries(
        prop.fields
          .map((field) => [field.key, buildStyleFieldDefault(field)] as const)
          .filter(([, value]) => value !== '')
      )
      if (Object.keys(styleDefaults).length > 0) {
        defaults[prop.name] = styleDefaults
      }
      continue
    }
    if (prop.type === 'color' && prop.default !== undefined) {
      defaults[prop.name] = normalizeColorDefault(prop.default)
      continue
    }
    if (prop.type === 'colors' && prop.default !== undefined) {
      defaults[prop.name] = prop.default.map(normalizeColorDefault)
      continue
    }
    if (prop.default !== undefined) {
      defaults[prop.name] = cloneDefaultValue(prop.default)
    }
  }

  for (const prop of propsConfig ?? []) {
    if (prop.disabled || !(prop.name in starterDefaults)) continue

    const starterValue = starterDefaults[prop.name]
    if (starterValue !== undefined) {
      defaults[prop.name] = cloneDefaultValue(starterValue)
    }
  }

  return defaults
}

/** Returns true when any interactive prop differs from its default value. */
export function hasDirtyPropOverrides(
  overrides: Record<string, unknown>,
  propsConfig?: PropConfig[],
  animationId?: string
): boolean {
  const defaults = buildPropDefaults(propsConfig, animationId)

  for (const key of Object.keys(overrides)) {
    const current = overrides[key]
    const def = defaults[key]

    if (isRecord(current) && isRecord(def)) {
      const nestedKeys = new Set([...Object.keys(current), ...Object.keys(def)])
      for (const nestedKey of nestedKeys) {
        if (current[nestedKey] !== def[nestedKey]) {
          return true
        }
      }
      continue
    }

    if (Array.isArray(current) && Array.isArray(def)) {
      if (current.length !== def.length || current.some((value, index) => value !== def[index])) {
        return true
      }
      continue
    }

    if (current !== def) {
      return true
    }
  }

  return false
}

interface AnimationInspectorProviderProps {
  currentGroup?: Group
  children: ReactNode
}

/** Manages per-animation prop overrides and replay version counters. */
function useOverridesAndReplay() {
  const [overridesByAnimationId, setOverridesByAnimationId] = useState<PropOverridesByAnimationId>(
    {}
  )
  const [replayVersionsByAnimationId, setReplayVersionsByAnimationId] =
    useState<ReplayVersionsByAnimationId>({})

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

  const resetPropOverrides = useCallback((animationId: string, propsConfig?: PropConfig[]) => {
    setOverridesByAnimationId((prev) => ({
      ...prev,
      [animationId]: buildPropDefaults(propsConfig, animationId),
    }))
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

/**
 * Provides animation inspector state (selection, prop overrides, replay) to the component tree.
 * Manages per-animation prop overrides and coordinates replay signals from the inspector panel.
 */
export function AnimationInspectorProvider({
  currentGroup,
  children,
}: AnimationInspectorProviderProps) {
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | undefined>(undefined)
  const {
    ensureOverrides,
    getPropOverrides,
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

  const clearSelection = useCallback(() => {
    setSelectedAnimationId(undefined)
  }, [])
  const isSelected = useCallback(
    (animationId: string) => selectedAnimationId === animationId,
    [selectedAnimationId]
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
