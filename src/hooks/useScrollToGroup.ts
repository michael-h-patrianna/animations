import type { RefObject } from 'react'
import { useEffect } from 'react'

/**
 * Hook to scroll a group section into view while keeping the app bar visible.
 *
 * Uses requestAnimationFrame and setTimeout fallback to handle asynchronous
 * DOM rendering. Calculates scroll position accounting for app bar height
 * and additional offset padding.
 *
 * @param {Object} params - Hook parameters
 * @param {string} params.currentGroupId - ID of the group to scroll into view
 * @param {RefObject<HTMLDivElement>} params.appBarRef - Ref to the app bar element for height calculation
 *
 * @example
 * ```tsx
 * const appBarRef = useRef<HTMLDivElement>(null)
 * const [currentGroupId, setCurrentGroupId] = useState('button-effects-framer')
 *
 * useScrollToGroup({ currentGroupId, appBarRef })
 * ```
 *
 * @remarks
 * - Prefixes group ID with 'group-' to match element IDs
 * - Falls back to data-app-shell="bar" selector if ref is null
 * - Uses auto scroll behavior for instant positioning
 * - Adds 16px extra offset below app bar for visual breathing room
 * - Retries scroll after 360ms if element not yet rendered
 */
export function useScrollToGroup({
  currentGroupId,
  appBarRef,
}: {
  currentGroupId: string
  appBarRef: RefObject<HTMLDivElement | null>
}) {
  useEffect(() => {
    if (!currentGroupId || typeof window === 'undefined') return

    const id = `group-${currentGroupId}`
    const EXTRA_OFFSET = 16
    let raf = 0
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

    const attemptScroll = () => {
      if (!scrollGroupIntoView()) {
        timeout = setTimeout(scrollGroupIntoView, 360)
      }
    }

    raf = requestAnimationFrame(attemptScroll)

    return () => {
      cancelAnimationFrame(raf)
      if (timeout) clearTimeout(timeout)
    }
  }, [currentGroupId, appBarRef])
}
