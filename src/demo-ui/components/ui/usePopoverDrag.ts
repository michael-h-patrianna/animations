import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type PointerEvent,
  type RefObject,
  type SetStateAction,
} from 'react'
import { useDragControls, useMotionValue, type MotionValue } from 'motion/react'
import { clampPopoverPosition } from '@/demo-ui/components/ui/usePopoverPositioning'

const DRAG_HANDLE_SELECTOR = '[data-popover-drag-handle="true"]'
const DRAG_IGNORE_SELECTOR = 'button, input, select, textarea, a, [role="button"], [role="link"]'

interface DragConstraints {
  left: number
  right: number
  top: number
  bottom: number
}

/**
 *
 */
export interface PopoverDragState {
  manualPositionRef: RefObject<{ top: number; left: number } | null>
  isDraggingRef: RefObject<boolean>
  dragControls: ReturnType<typeof useDragControls>
  dragX: MotionValue<number>
  dragY: MotionValue<number>
  isDragging: boolean
  dragConstraints: DragConstraints
  setDragConstraints: Dispatch<SetStateAction<DragConstraints>>
  applyPositionRef: RefObject<((position: { top: number; left: number }) => void) | null>
  handleDragEnd: () => void
  handlePointerDown: (event: PointerEvent<HTMLDivElement>) => void
  onDragStart: () => void
  setIsDragging: Dispatch<SetStateAction<boolean>>
}

/**
 * Owns draggable popover state, pointer guards, and final manual position capture.
 *
 * @param draggable - Whether drag should respond to drag handle pointer events.
 * @param popoverRef - Fixed-position popover wrapper element.
 * @param surfaceRef - Visible draggable surface element.
 * @returns Drag state and handlers consumed by Popover rendering and positioning.
 */
export function usePopoverDrag(
  draggable: boolean,
  popoverRef: RefObject<HTMLDivElement | null>,
  surfaceRef: RefObject<HTMLDivElement | null>
): PopoverDragState {
  const manualPositionRef = useRef<{ top: number; left: number } | null>(null)
  const isDraggingRef = useRef(false)
  const dragControls = useDragControls()
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  const applyPositionRef = useRef<((position: { top: number; left: number }) => void) | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })

  const handleDragEnd = useCallback(() => {
    const popover = popoverRef.current
    const surface = surfaceRef.current
    if (!popover || !surface) return

    const basePosition = {
      left: Number.parseFloat(popover.style.left !== '' ? popover.style.left : '0'),
      top: Number.parseFloat(popover.style.top !== '' ? popover.style.top : '0'),
    }
    const nextPosition = clampPopoverPosition(
      {
        left: basePosition.left + dragX.get(),
        top: basePosition.top + dragY.get(),
      },
      surface.getBoundingClientRect()
    )

    manualPositionRef.current = nextPosition
    dragX.jump(0)
    dragY.jump(0)
    applyPositionRef.current?.(nextPosition)
    isDraggingRef.current = false
    setIsDragging(false)
  }, [dragX, dragY, popoverRef, surfaceRef])

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!draggable || event.button !== 0) return

      const target = event.target as HTMLElement | null
      if (target == null) return
      if (target.closest(DRAG_IGNORE_SELECTOR)) return
      if (target.closest(DRAG_HANDLE_SELECTOR) == null) return

      dragControls.start(event, { snapToCursor: false })
      event.preventDefault()
    },
    [dragControls, draggable]
  )

  const onDragStart = useCallback(() => {
    isDraggingRef.current = true
    setIsDragging(true)
  }, [])

  return {
    manualPositionRef,
    isDraggingRef,
    dragControls,
    dragX,
    dragY,
    isDragging,
    dragConstraints,
    setDragConstraints,
    applyPositionRef,
    handleDragEnd,
    handlePointerDown,
    onDragStart,
    setIsDragging,
  }
}
