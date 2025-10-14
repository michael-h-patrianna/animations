import { useEffect } from 'react'

/**
 * Hook to handle ESC key press for closing modals or drawers.
 *
 * Attaches a global keydown listener when the target is open, calling the
 * onClose callback when ESC is pressed. Automatically cleans up listener
 * when target closes or component unmounts.
 *
 * @param {Object} params - Hook parameters
 * @param {boolean} params.isOpen - Whether the target (drawer/modal) is currently open
 * @param {() => void} params.onClose - Callback to close the target
 *
 * @example
 * ```tsx
 * const [isDrawerOpen, setIsDrawerOpen] = useState(false)
 *
 * useKeyboardShortcut({
 *   isOpen: isDrawerOpen,
 *   onClose: () => setIsDrawerOpen(false)
 * })
 * ```
 *
 * @remarks
 * - Only attaches listener when isOpen is true for performance
 * - Automatically removes listener on cleanup
 * - Key check is case-sensitive ('Escape')
 */
export function useKeyboardShortcut({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])
}
