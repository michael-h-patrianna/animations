import type { RefObject } from 'react'
import { useEffect } from 'react'

/**
 * Hook to scroll a group section into view while keeping the app bar visible.
 *
 * Uses a MutationObserver to wait for the target element to appear in the DOM
 * (e.g. after an AnimatePresence transition), then scrolls it into view
 * accounting for app bar height.
 *
 * @param {Object} params - Hook parameters
 * @param {string} params.currentGroupId - ID of the group to scroll into view
 * @param {RefObject<HTMLDivElement>} params.appBarRef - Ref to the app bar element for height calculation
 *
 * @remarks
 * - Prefixes group ID with 'group-' to match element IDs
 * - Falls back to data-app-shell="bar" selector if ref is null
 * - Uses auto scroll behavior for instant positioning
 * - Adds 16px extra offset below app bar for visual breathing room
 * - Uses MutationObserver with 2s safety timeout for elements not yet rendered
 */
export function useScrollToGroup({
  currentGroupId,
  appBarRef,
}: {
  currentGroupId: string
  appBarRef: RefObject<HTMLDivElement | null>
}) {
  useEffect(() => {
    if (currentGroupId === '' || typeof window === 'undefined') return

    const id = `group-${currentGroupId}`
    const EXTRA_OFFSET = 16
    const OBSERVER_TIMEOUT_MS = 2000
    let observer: MutationObserver | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined

    const scrollGroupIntoView = () => {
      const el = document.getElementById(id)
      if (!el) return false

      const appBar =
        appBarRef.current ?? document.querySelector<HTMLElement>('[data-app-shell="bar"]')
      const appBarHeight = appBar?.getBoundingClientRect().height ?? 0
      const targetY = Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - appBarHeight - EXTRA_OFFSET
      )

      if (Math.abs(window.scrollY - targetY) > 1) {
        window.scrollTo({ top: targetY, behavior: 'auto' })
      }

      return true
    }

    if (!scrollGroupIntoView()) {
      // Element not in DOM yet (e.g. AnimatePresence transition in progress).
      // Watch for it via MutationObserver instead of a fixed timeout.
      observer = new MutationObserver(() => {
        if (scrollGroupIntoView()) {
          observer?.disconnect()
          if (timeout) clearTimeout(timeout)
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })

      // Safety: disconnect after 2s to avoid leaked observers
      timeout = setTimeout(() => observer?.disconnect(), OBSERVER_TIMEOUT_MS)
    }

    return () => {
      observer?.disconnect()
      if (timeout) clearTimeout(timeout)
    }
  }, [currentGroupId, appBarRef])
}
