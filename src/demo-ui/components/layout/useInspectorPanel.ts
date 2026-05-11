import { useCallback, useMemo } from 'react'
import { hasDirtyPropOverrides, useAnimationInspector } from '@/contexts/AnimationInspectorContext'

/**
 * Collects inspector context state and write handlers for the right panel.
 *
 * @returns Selected animation data, derived prop groups, and mutation callbacks.
 */
export function useInspectorPanel() {
  const {
    selectedAnimation,
    getPropOverrides,
    getBasePropOverrides,
    setPropOverride,
    resetPropOverrides,
    replayAnimation,
    getAnimateMode,
    setAnimateMode,
  } = useAnimationInspector()

  const propOverrides = useMemo(
    () =>
      selectedAnimation != null
        ? getPropOverrides(selectedAnimation.id, selectedAnimation.props)
        : undefined,
    [selectedAnimation, getPropOverrides]
  )

  const basePropOverrides = useMemo(
    () =>
      selectedAnimation != null
        ? getBasePropOverrides(selectedAnimation.id, selectedAnimation.props)
        : undefined,
    [selectedAnimation, getBasePropOverrides]
  )

  const editableProps = useMemo(
    () => selectedAnimation?.props?.filter((prop) => prop.disabled !== true) ?? [],
    [selectedAnimation]
  )

  const codeOnlyProps = useMemo(
    () => selectedAnimation?.props?.filter((prop) => prop.disabled === true) ?? [],
    [selectedAnimation]
  )

  const isDirty =
    selectedAnimation != null && basePropOverrides != null
      ? hasDirtyPropOverrides(basePropOverrides, selectedAnimation.props, selectedAnimation.id)
      : false

  const handlePropChange = useCallback(
    (name: string, value: unknown) => {
      if (selectedAnimation == null) return
      setPropOverride(selectedAnimation.id, selectedAnimation.props, name, value)
      replayAnimation(selectedAnimation.id)
    },
    [selectedAnimation, setPropOverride, replayAnimation]
  )

  const handleReset = useCallback(() => {
    if (selectedAnimation == null) return
    resetPropOverrides(selectedAnimation.id, selectedAnimation.props)
    replayAnimation(selectedAnimation.id)
  }, [selectedAnimation, resetPropOverrides, replayAnimation])

  const handleReplay = useCallback(() => {
    if (selectedAnimation == null) return
    replayAnimation(selectedAnimation.id)
  }, [selectedAnimation, replayAnimation])

  return {
    selectedAnimation,
    propOverrides,
    editableProps,
    codeOnlyProps,
    isDirty,
    handlePropChange,
    handleReset,
    handleReplay,
    getAnimateMode,
    setAnimateMode,
  }
}
