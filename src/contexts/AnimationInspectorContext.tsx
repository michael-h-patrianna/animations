import type { Animation, Group, PropConfig } from '@/types/animation'
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

type PropOverridesByAnimationId = Record<string, Record<string, unknown>>
type ReplayVersionsByAnimationId = Record<string, number>

interface AnimationInspectorContextValue {
  selectedAnimationId?: string
  selectedAnimation?: Animation
  selectAnimation: (animation: Animation) => void
  clearSelection: () => void
  isSelected: (animationId: string) => boolean
  getPropOverrides: (animationId: string, propsConfig?: PropConfig[]) => Record<string, unknown>
  setPropOverride: (animationId: string, propsConfig: PropConfig[] | undefined, name: string, value: unknown) => void
  resetPropOverrides: (animationId: string, propsConfig?: PropConfig[]) => void
  getReplayVersion: (animationId: string) => number
  replayAnimation: (animationId: string) => void
}

const AnimationInspectorContext = createContext<AnimationInspectorContextValue | undefined>(undefined)

/** Builds the inspector's default override record from editable prop metadata. */
export function buildPropDefaults(propsConfig?: PropConfig[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}

  for (const prop of propsConfig ?? []) {
    if (prop.disabled) continue
    if (prop.default !== undefined) {
      defaults[prop.name] = prop.default
    }
  }

  return defaults
}

/** Returns true when any interactive prop differs from its default value. */
export function hasDirtyPropOverrides(
  overrides: Record<string, unknown>,
  propsConfig?: PropConfig[]
): boolean {
  const defaults = buildPropDefaults(propsConfig)

  for (const key of Object.keys(overrides)) {
    const current = overrides[key]
    const def = defaults[key]

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

export function AnimationInspectorProvider({
  currentGroup,
  children,
}: AnimationInspectorProviderProps) {
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | undefined>(undefined)
  const [overridesByAnimationId, setOverridesByAnimationId] = useState<PropOverridesByAnimationId>({})
  const [replayVersionsByAnimationId, setReplayVersionsByAnimationId] =
    useState<ReplayVersionsByAnimationId>({})

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

  const ensureOverrides = useCallback((animationId: string, propsConfig?: PropConfig[]) => {
    const defaults = buildPropDefaults(propsConfig)
    setOverridesByAnimationId((prev) => (prev[animationId] != null ? prev : { ...prev, [animationId]: defaults }))
    return defaults
  }, [])

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

  const getPropOverrides = useCallback(
    (animationId: string, propsConfig?: PropConfig[]) =>
      overridesByAnimationId[animationId] ?? buildPropDefaults(propsConfig),
    [overridesByAnimationId]
  )

  const setPropOverride = useCallback(
    (animationId: string, propsConfig: PropConfig[] | undefined, name: string, value: unknown) => {
      setOverridesByAnimationId((prev) => ({
        ...prev,
        [animationId]: {
          ...(prev[animationId] ?? buildPropDefaults(propsConfig)),
          [name]: value,
        },
      }))
    },
    []
  )

  const resetPropOverrides = useCallback((animationId: string, propsConfig?: PropConfig[]) => {
    setOverridesByAnimationId((prev) => ({
      ...prev,
      [animationId]: buildPropDefaults(propsConfig),
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

export function useAnimationInspector() {
  const context = use(AnimationInspectorContext)

  if (context === undefined) {
    throw new Error('useAnimationInspector must be used within an AnimationInspectorProvider')
  }

  return context
}
