import { useCallback, useEffect, useLayoutEffect, type RefObject } from 'react'
import type { PopoverDragState } from '@/demo-ui/components/ui/usePopoverDrag'

const VIEWPORT_PADDING = 8

interface ViewportRect {
  width: number
  height: number
}

interface PositionRect {
  top: number
  left: number
  width: number
  height: number
}

interface UsePopoverPositioningOptions {
  isOpen: boolean
  side: 'top' | 'bottom'
  align: 'start' | 'end' | 'center'
  offset: number
  popoverRef: RefObject<HTMLDivElement | null>
  surfaceRef: RefObject<HTMLDivElement | null>
  triggerRef: RefObject<HTMLDivElement | null>
  drag: PopoverDragState
}

function getViewportRect(): ViewportRect {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/** Clamps a popover position to stay within viewport bounds with padding. */
export function clampPopoverPosition(
  position: Pick<PositionRect, 'top' | 'left'>,
  popoverRect: Pick<PositionRect, 'width' | 'height'>
) {
  const viewport = getViewportRect()
  const maxLeft = Math.max(VIEWPORT_PADDING, viewport.width - popoverRect.width - VIEWPORT_PADDING)
  const maxTop = Math.max(VIEWPORT_PADDING, viewport.height - popoverRect.height - VIEWPORT_PADDING)

  return {
    left: Math.min(Math.max(position.left, VIEWPORT_PADDING), maxLeft),
    top: Math.min(Math.max(position.top, VIEWPORT_PADDING), maxTop),
  }
}

function computePopoverPosition(
  triggerEl: HTMLElement,
  popoverEl: HTMLElement | null,
  side: 'top' | 'bottom',
  align: 'start' | 'end' | 'center',
  offset: number
): { top: number; left: number } {
  const triggerRect = triggerEl.getBoundingClientRect()
  const popoverRect = popoverEl?.getBoundingClientRect() || { width: 0, height: 0 }
  const spaceAbove = triggerRect.top - offset - VIEWPORT_PADDING
  const spaceBelow = window.innerHeight - triggerRect.bottom - offset - VIEWPORT_PADDING
  const preferredTop =
    side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - popoverRect.height - offset
  const fallbackTop =
    side === 'bottom' ? triggerRect.top - popoverRect.height - offset : triggerRect.bottom + offset
  const preferredFits =
    side === 'bottom'
      ? triggerRect.bottom + offset + popoverRect.height <= window.innerHeight - VIEWPORT_PADDING
      : preferredTop >= VIEWPORT_PADDING
  const fallbackFits =
    side === 'bottom'
      ? fallbackTop >= VIEWPORT_PADDING
      : triggerRect.bottom + offset + popoverRect.height <= window.innerHeight - VIEWPORT_PADDING

  const top =
    preferredFits || (!fallbackFits && spaceBelow >= spaceAbove) ? preferredTop : fallbackTop
  const left =
    align === 'start'
      ? triggerRect.left
      : align === 'end'
        ? triggerRect.right - popoverRect.width
        : triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2

  return clampPopoverPosition({ top, left }, popoverRect)
}

/**
 * Positions an open popover and keeps drag constraints in sync with viewport bounds.
 *
 * @param options - Popover element refs, placement settings, and drag state.
 * @returns Nothing.
 */
export function usePopoverPositioning({
  isOpen,
  side,
  align,
  offset,
  popoverRef,
  surfaceRef,
  triggerRef,
  drag,
}: UsePopoverPositioningOptions): void {
  const {
    manualPositionRef,
    isDraggingRef,
    dragX,
    dragY,
    setDragConstraints,
    setIsDragging,
    applyPositionRef,
  } = drag

  const applyPopoverPosition = useCallback(
    (position: { top: number; left: number }) => {
      const popover = popoverRef.current
      const surface = surfaceRef.current
      if (!popover || !surface) return

      popover.style.top = `${String(position.top)}px`
      popover.style.left = `${String(position.left)}px`

      const surfaceRect = surface.getBoundingClientRect()
      const maxLeft = Math.max(
        VIEWPORT_PADDING,
        window.innerWidth - surfaceRect.width - VIEWPORT_PADDING
      )
      const maxTop = Math.max(
        VIEWPORT_PADDING,
        window.innerHeight - surfaceRect.height - VIEWPORT_PADDING
      )

      setDragConstraints({
        left: VIEWPORT_PADDING - position.left,
        right: maxLeft - position.left,
        top: VIEWPORT_PADDING - position.top,
        bottom: maxTop - position.top,
      })
    },
    [popoverRef, surfaceRef, setDragConstraints]
  )

  applyPositionRef.current = applyPopoverPosition

  const updatePosition = useCallback(() => {
    if (isDraggingRef.current) return

    const trigger = triggerRef.current
    const popover = popoverRef.current
    const surface = surfaceRef.current
    if (!trigger || !popover || !surface || !isOpen) return

    if (manualPositionRef.current) {
      const nextPosition = clampPopoverPosition(
        manualPositionRef.current,
        surface.getBoundingClientRect()
      )
      manualPositionRef.current = nextPosition
      dragX.jump(0)
      dragY.jump(0)
      applyPopoverPosition(nextPosition)
      return
    }

    const nextPosition = computePopoverPosition(trigger, surface, side, align, offset)
    dragX.jump(0)
    dragY.jump(0)
    applyPopoverPosition(nextPosition)
  }, [
    applyPopoverPosition,
    dragX,
    dragY,
    isOpen,
    side,
    align,
    offset,
    isDraggingRef,
    triggerRef,
    popoverRef,
    surfaceRef,
    manualPositionRef,
  ])

  useLayoutEffect(() => {
    if (!isOpen) return

    let rafId: number | null = null
    const schedulePositionUpdate = () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        updatePosition()
        rafId = null
      })
    }
    const syncPositionUpdate = () => {
      updatePosition()
      schedulePositionUpdate()
    }

    const surfaceEl = surfaceRef.current
    const resizeObserver = surfaceEl == null ? null : new ResizeObserver(() => syncPositionUpdate())

    syncPositionUpdate()
    window.addEventListener('resize', syncPositionUpdate)
    window.addEventListener('scroll', syncPositionUpdate, true)
    if (surfaceEl != null) {
      resizeObserver?.observe(surfaceEl)
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncPositionUpdate)
      window.removeEventListener('scroll', syncPositionUpdate, true)
    }
  }, [isOpen, updatePosition, surfaceRef])

  useEffect(() => {
    if (isOpen) return
    manualPositionRef.current = null
    dragX.set(0)
    dragY.set(0)
    setIsDragging(false)
  }, [dragX, dragY, isOpen, manualPositionRef, setIsDragging])
}
