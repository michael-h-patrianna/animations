import { useCallback, useState } from 'react'
import { nextStopId } from '@/demo-ui/lib/colors/gradientUtils'
import type { GradientStop, LinearGradientValue } from '@/types/gradient'
import { MAX_STOPS, MIN_STOPS } from '@/demo-ui/components/ui/gradientEditorColor'
import type { StopWithKey } from '@/demo-ui/components/ui/gradientEditorTypes'

/**
 * Owns keyed stop state and mutations for the gradient editor.
 *
 * @param value - Current linear gradient value.
 * @param onChange - Callback receiving updated gradient values.
 * @returns Stable state and handlers for gradient editing controls.
 */
export function useGradientEditorState(
  value: LinearGradientValue,
  onChange: (v: LinearGradientValue) => void
) {
  const [stopsWithKeys, setStopsWithKeys] = useState<StopWithKey[]>(() =>
    value.stops.map((s) => ({ ...s, key: nextStopId() }))
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [editingStopColor, setEditingStopColor] = useState(false)

  const syncStopsFromValue = useCallback((newStops: GradientStop[]) => {
    setStopsWithKeys((prev) => {
      if (prev.length === newStops.length) {
        return prev.map((s, i) => ({ ...newStops[i]!, key: s.key }))
      }
      return newStops.map((s, i) => ({ ...s, key: prev[i]?.key ?? nextStopId() }))
    })
  }, [])

  const emitChange = useCallback(
    (newStops: GradientStop[], newAngle?: number) => {
      onChange({ type: 'linear-gradient', angle: newAngle ?? value.angle, stops: newStops })
      syncStopsFromValue(newStops)
    },
    [onChange, value.angle, syncStopsFromValue]
  )

  return {
    stopsWithKeys,
    selectedIndex,
    editingStopColor,
    setEditingStopColor,
    selectedStop: value.stops[Math.min(selectedIndex, value.stops.length - 1)],
    handleStopPositionChange: useCallback(
      (index: number, position: number) => {
        emitChange(value.stops.map((s, i) => (i === index ? { ...s, position } : s)))
      },
      [value.stops, emitChange]
    ),
    handleStopColorChange: useCallback(
      (color: string) => {
        emitChange(value.stops.map((s, i) => (i === selectedIndex ? { ...s, color } : s)))
      },
      [value.stops, selectedIndex, emitChange]
    ),
    handleAddStop: useCallback(
      (position: number, color: string) => {
        if (value.stops.length >= MAX_STOPS) return
        const newStops = [...value.stops, { color, position }]
        emitChange(newStops)
        setSelectedIndex(newStops.length - 1)
      },
      [value.stops, emitChange]
    ),
    handleRemoveStop: useCallback(
      (index: number) => {
        if (value.stops.length <= MIN_STOPS) return
        const newStops = value.stops.filter((_, i) => i !== index)
        emitChange(newStops)
        setSelectedIndex((prev) => Math.min(prev, newStops.length - 1))
      },
      [value.stops, emitChange]
    ),
    handleAngleChange: useCallback(
      (angle: number) => emitChange(value.stops, angle),
      [value.stops, emitChange]
    ),
    handleSelectStop: useCallback((index: number) => {
      setSelectedIndex(index)
      setEditingStopColor(true)
    }, []),
  }
}
