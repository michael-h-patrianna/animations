import { useCallback, useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react'
import type { HSVA } from '@/demo-ui/lib/colors/colorUtils'
import { computeSaturationValue } from '@/demo-ui/components/ui/colorPickerPanelActions'

interface SaturationDragState {
  svRef: RefObject<HTMLDivElement | null>
  handleSaturationMouseDown: (event: MouseEvent) => void
}

/**
 * Tracks pointer dragging inside the saturation/value color plane.
 *
 * @param hsv - Current HSV color state.
 * @param onHsvChange - Callback receiving updated HSV state.
 * @returns Ref and mouse handler for the saturation area.
 */
export function useSaturationDrag(
  hsv: HSVA,
  onHsvChange: (hsv: HSVA) => void
): SaturationDragState {
  const svRef = useRef<HTMLDivElement>(null)
  const [isDraggingSV, setIsDraggingSV] = useState(false)

  const updateSV = useCallback(
    (clientX: number, clientY: number) => {
      if (!svRef.current) return
      const { s, v } = computeSaturationValue(svRef.current, clientX, clientY)
      onHsvChange({ ...hsv, s, v })
    },
    [hsv, onHsvChange]
  )

  const updateSVRef = useRef(updateSV)
  updateSVRef.current = updateSV

  useEffect(() => {
    if (!isDraggingSV) return
    const onMove = (e: globalThis.MouseEvent) => updateSVRef.current(e.clientX, e.clientY)
    const onUp = () => setIsDraggingSV(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDraggingSV])

  const handleSaturationMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      setIsDraggingSV(true)
      updateSV(event.clientX, event.clientY)
    },
    [updateSV]
  )

  return { svRef, handleSaturationMouseDown }
}
