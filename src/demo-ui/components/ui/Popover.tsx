import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useId } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { soundManager } from '@/demo-ui/lib/audio/SoundManager'
import { sx } from '@/demo-ui/lib/sx'

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
}

/**
 * Computes popover position relative to a trigger element, with viewport collision handling.
 */
function computePopoverPosition(
  triggerEl: HTMLElement,
  popoverEl: HTMLElement | null,
  side: 'top' | 'bottom',
  align: 'start' | 'end' | 'center',
  offset: number
): { top: number; left: number } {
  const triggerRect = triggerEl.getBoundingClientRect()
  const popoverRect = popoverEl?.getBoundingClientRect() || { width: 0, height: 0 }

  let top =
    side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - popoverRect.height - offset
  let left =
    align === 'start'
      ? triggerRect.left
      : align === 'end'
        ? triggerRect.right - popoverRect.width
        : triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2

  // Flip to top if bottom overflows
  if (side === 'bottom' && top + popoverRect.height > window.innerHeight) {
    top = triggerRect.top - popoverRect.height - offset
  }

  left = Math.max(8, Math.min(left, window.innerWidth - popoverRect.width - 8))
  return { top, left }
}

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
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverId = useId()

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

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

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    const popover = popoverRef.current
    if (!trigger || !popover || !isOpen) return

    const { top, left } = computePopoverPosition(trigger, popover, side, align, offset)
    popover.style.top = `${String(top)}px`
    popover.style.left = `${String(left)}px`
  }, [isOpen, side, align, offset])

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    }
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, updatePosition])

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
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              className="glass-panel rounded-lg shadow-2xl border border-border-default"
              style={sx({ backdropFilter: 'blur(24px)' })}
            >
              {content}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
