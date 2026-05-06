import React, { useState, useRef, useEffect, useCallback, useId } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { soundManager } from '@/demo-ui/lib/audio/SoundManager'
import { sx } from '@/demo-ui/lib/sx'
import { usePopoverDrag } from '@/demo-ui/components/ui/usePopoverDrag'
import { usePopoverPositioning } from '@/demo-ui/components/ui/usePopoverPositioning'

/** Props for the Popover component */
export interface PopoverProps {
  /** The trigger element that opens the popover on click */
  trigger: React.ReactNode
  /** The content to display inside the popover */
  content: React.ReactNode
  /** Additional CSS classes for the popover content container */
  className?: string
  /** Horizontal alignment relative to the trigger */
  align?: 'start' | 'end' | 'center'
  /** Vertical side to display the popover */
  side?: 'top' | 'bottom'
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Pixel offset from the trigger element */
  offset?: number
  /** Allow the popover to be repositioned via a drag handle inside the content */
  draggable?: boolean
}

/** Props for the floating popover surface. */
interface PopoverSurfaceProps {
  surfaceRef: React.RefObject<HTMLDivElement | null>
  draggable: boolean
  drag: ReturnType<typeof usePopoverDrag>
  content: React.ReactNode
}

const PopoverSurface: React.FC<PopoverSurfaceProps> = ({
  surfaceRef,
  draggable,
  drag,
  content,
}) => (
  <m.div
    ref={surfaceRef}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    drag={draggable}
    dragControls={drag.dragControls}
    dragListener={false}
    dragMomentum={false}
    dragElastic={0}
    dragConstraints={drag.dragConstraints}
    onDragStart={drag.onDragStart}
    onDragEnd={drag.handleDragEnd}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="glass-panel rounded-lg shadow-2xl border border-border-default"
    onPointerDown={drag.handlePointerDown}
    style={{
      backdropFilter: 'blur(24px)',
      maxWidth: 'calc(100dvw - 16px)',
      maxHeight: 'calc(100dvh - 16px)',
      overflow: 'auto',
      x: drag.dragX,
      y: drag.dragY,
      cursor: draggable && drag.isDragging ? 'grabbing' : undefined,
    }}
  >
    {content}
  </m.div>
)

/**
 * Floating popover component with automatic positioning and animations.
 *
 * Supports both controlled and uncontrolled modes. Automatically repositions
 * to stay within viewport bounds. Closes on outside click or Escape key.
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  className = '',
  align = 'start',
  side = 'bottom',
  open: controlledOpen,
  onOpenChange,
  offset = 4,
  draggable = false,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverId = useId()

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const drag = usePopoverDrag(draggable, popoverRef, surfaceRef)
  usePopoverPositioning({
    isOpen,
    side,
    align,
    offset,
    popoverRef,
    surfaceRef,
    triggerRef,
    drag,
  })

  const prevIsOpenRef = useRef(isOpen)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      soundManager.playSwish()
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  useEffect(() => {
    const popover = popoverRef.current
    if (!popover) return
    if (isOpen && !popover.matches(':popover-open')) {
      popover.showPopover()
    } else if (!isOpen && popover.matches(':popover-open')) {
      popover.hidePopover()
    }
  }, [isOpen])

  useEffect(() => {
    const popover = popoverRef.current
    if (!popover) return
    const handleToggle = (e: Event) => {
      handleOpenChange((e as ToggleEvent).newState === 'open')
    }
    popover.addEventListener('toggle', handleToggle)
    return () => {
      popover.removeEventListener('toggle', handleToggle)
    }
  }, [handleOpenChange])

  return (
    <>
      <div
        data-testid="popover-open-change"
        ref={triggerRef}
        onClick={() => {
          handleOpenChange(!isOpen)
        }}
        className={`inline-block cursor-pointer ${className}`}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      <div
        ref={popoverRef}
        popover="auto"
        id={popoverId}
        className="m-0 p-0 border-none bg-transparent"
        style={sx({
          position: 'fixed' as const,
          top: 0,
          left: 0,
        })}
      >
        <AnimatePresence>
          {isOpen && (
            <PopoverSurface
              surfaceRef={surfaceRef}
              draggable={draggable}
              drag={drag}
              content={content}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
