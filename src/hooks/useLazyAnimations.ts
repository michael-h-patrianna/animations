import '@/components/lazyBootstrap'
import { getLazyNavCatalog, isGroupCached, loadLazyGroup } from '@/lib/lazyGroupRegistry'
import type { Group } from '@/types/animation'
import type { LazyAnimationsResult } from '@/types/lazy'
import { useCallback, useMemo, useRef, useState } from 'react'

/**
 * Navigation catalog — computed once at module initialization.
 * Category registrations happen synchronously via lazyBootstrap side-effect
 * imports, so the catalog is fully populated before the first render.
 */
const navCatalog = getLazyNavCatalog()

/**
 * Hook for lazy-loading animation groups.
 *
 * Returns the navigation catalog (always available synchronously)
 * and methods to load groups on demand. Groups are cached after
 * first load to avoid redundant network requests.
 *
 * @example
 * ```typescript
 * const { navCatalog, currentGroup, isLoading, loadGroup } = useLazyAnimations()
 *
 * // Navigate to a group
 * await loadGroup('modal-base-framer')
 * ```
 */
export function useLazyAnimations(): LazyAnimationsResult {
  // Current loaded group state
  const [currentGroupId, setCurrentGroupId] = useState<string>('')
  const [currentGroup, setCurrentGroup] = useState<Group | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  // Refs for stable loadGroup identity — avoids re-creating the callback
  // (and re-running downstream effects) on every group navigation.
  const currentGroupIdRef = useRef(currentGroupId)
  currentGroupIdRef.current = currentGroupId
  const currentGroupRef = useRef(currentGroup)
  currentGroupRef.current = currentGroup

  // Ref for deduplicating concurrent load requests
  const loadingRef = useRef<string | null>(null)

  /**
   * Loads a group by ID.
   * If already cached, returns immediately from cache.
   * If already loading the same group, waits for existing request.
   */
  const loadGroup = useCallback(async (groupId: string): Promise<void> => {
    // Skip if already loaded this group
    if (currentGroupIdRef.current === groupId && currentGroupRef.current) {
      return
    }

    // Check if already cached
    if (isGroupCached(groupId)) {
      try {
        const result = await loadLazyGroup(groupId)
        setCurrentGroupId(groupId)
        setCurrentGroup(result.group)
        setError(undefined)
        return
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        return
      }
    }

    // Prevent duplicate requests for same group
    if (loadingRef.current === groupId) {
      return
    }
    loadingRef.current = groupId

    setIsLoading(true)
    setError(undefined)

    try {
      const result = await loadLazyGroup(groupId)
      setCurrentGroupId(groupId)
      setCurrentGroup(result.group)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
      loadingRef.current = null
    }
  }, [])

  return useMemo(
    () => ({
      navCatalog,
      currentGroup,
      isLoading,
      error,
      loadGroup,
      isGroupCached,
    }),
    [currentGroup, isLoading, error, loadGroup]
  )
}
