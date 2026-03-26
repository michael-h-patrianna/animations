import '@/components/lazyBootstrap'
import { getLazyNavCatalog, isGroupCached, loadLazyGroup } from '@/lib/lazyGroupRegistry'
import { reportAppError } from '@/services/errorTracking'
import type { Group } from '@/types/animation'
import type { LazyAnimationsResult } from '@/types/lazy'
import { useCallback, useMemo, useRef, useState, useTransition } from 'react'

/**
 * Navigation catalog — computed once at module initialization.
 * Category registrations happen synchronously via lazyBootstrap side-effect
 * imports, so the catalog is fully populated before the first render.
 */
const navCatalog = getLazyNavCatalog()

/**
 * Hook for lazy-loading animation groups.
 *
 * Uses React 19's `useTransition` to keep the UI responsive during group
 * loading. The previous group stays visible while the next one loads —
 * no loading spinner for cached groups, smooth handoff for uncached ones.
 *
 * @example
 * ```typescript
 * const { navCatalog, currentGroup, isPending, loadGroup } = useLazyAnimations()
 *
 * // Navigate to a group — wraps in a transition automatically
 * await loadGroup('modal-base-framer')
 * ```
 */
export function useLazyAnimations(): LazyAnimationsResult {
  const [isPending, startTransition] = useTransition()
  const [currentGroup, setCurrentGroup] = useState<Group | undefined>()
  const [error, setError] = useState<Error | undefined>()

  // Refs for stable loadGroup identity — avoids re-creating the callback
  // (and re-running downstream effects) on every group navigation.
  const currentGroupIdRef = useRef('')
  const currentGroupRef = useRef(currentGroup)
  currentGroupRef.current = currentGroup

  /**
   * Loads a group by ID, wrapped in a React transition.
   *
   * Cached groups resolve synchronously — the transition completes instantly
   * and `isPending` never flickers. Uncached groups trigger an async load
   * where `isPending` stays true until the new group renders.
   */
  const loadGroup = useCallback(
    async (groupId: string): Promise<void> => {
      // Skip if already showing this group
      if (currentGroupIdRef.current === groupId && currentGroupRef.current) {
        return
      }
      currentGroupIdRef.current = groupId

      try {
        const result = await loadLazyGroup(groupId)

        // Wrap state updates in a transition so React keeps showing the
        // previous group while the new one prepares to render.
        startTransition(() => {
          setCurrentGroup(result.group)
          setError(undefined)
        })
      } catch (err) {
        const cause = err instanceof Error ? err : new Error(String(err))
        reportAppError({ type: 'GROUP_LOAD_FAILURE', groupId, cause, timestamp: Date.now() })
        setError(cause)
      }
    },
    [startTransition]
  )

  return useMemo(
    () => ({
      navCatalog,
      currentGroup,
      isPending,
      error,
      loadGroup,
      isGroupCached,
    }),
    [currentGroup, isPending, error, loadGroup]
  )
}
