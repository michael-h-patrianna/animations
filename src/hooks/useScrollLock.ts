import { useEffect } from 'react'

/**
 * Hook to prevent background scrolling when a modal or drawer is open.
 *
 * Temporarily sets `document.body.style.overflow = 'hidden'` while the target
 * is open, then restores the previous overflow value on close or unmount.
 *
 * @param {boolean} isOpen - Whether the target (drawer/modal) is currently open
 *
 * @example
 * ```tsx
 * const [isDrawerOpen, setIsDrawerOpen] = useState(false)
 * useScrollLock(isDrawerOpen)
 * ```
 *
 * @remarks
 * - Preserves original overflow value for proper restoration
 * - Useful for mobile drawers and full-screen modals
 * - Automatically cleans up on component unmount
 */
export function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isOpen])
}
