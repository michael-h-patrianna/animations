import { useCallback, useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Manages modal focus trap and restoration.
 *
 * On mount, saves the currently focused element and moves focus to `initialFocusRef`.
 * On unmount, restores focus to the previously focused element.
 * While active, Tab/Shift+Tab cycle within the container.
 *
 * @param containerRef - Ref to the modal container element
 * @param initialFocusRef - Ref to the element that should receive focus on open
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  initialFocusRef: React.RefObject<HTMLElement | null>
) {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
    initialFocusRef.current?.focus()
    return () => {
      previousFocusRef.current?.focus()
    }
  }, [initialFocusRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [containerRef])
}

/**
 * Closes a modal when the Escape key is pressed.
 *
 * When the component using this hook is always mounted (e.g. a drawer toggled
 * by state), pass `enabled` to control when the listener is active. When the
 * component mounts/unmounts with the modal (e.g. portaled modals), `enabled`
 * can be omitted — the default `true` means the listener is active for the
 * component's entire lifetime.
 *
 * @param onClose - Callback to invoke on Escape keypress
 * @param enabled - Whether the listener is active (default: true)
 */
export function useEscapeClose(onClose: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, enabled])
}

/**
 * Closes a modal when clicking the overlay background (outside the modal content).
 *
 * @param overlayRef - Ref to the overlay element (the backdrop)
 * @param onClose - Callback to invoke on overlay click
 * @returns Click handler to attach to the overlay element
 */
export function useOverlayDismiss(
  overlayRef: React.RefObject<HTMLElement | null>,
  onClose: () => void
) {
  return useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [overlayRef, onClose]
  )
}
