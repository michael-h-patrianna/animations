import '@/components/lazyBootstrap'
import { getLazyNavCatalog, isGroupCached, loadLazyGroup } from '@/lib/lazyGroupRegistry'
import type { Group } from '@/types/animation'
import type { LazyAnimationsResult, LazyNavCatalog } from '@/types/lazy'
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from 'react'

// ============================================================================
// Subscription Store for Nav Catalog
// ============================================================================

/** Simple store for nav catalog subscription */
const navStore = {
  catalog: getLazyNavCatalog(),
  listeners: new Set<() => void>(),

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  },

  notify(): void {
    for (const listener of this.listeners) {
      listener()
    }
  },

  getSnapshot(): LazyNavCatalog {
    return this.catalog
  },
}

// ============================================================================
// Hook
// ============================================================================

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
  // Get nav catalog via sync external store (reacts to registration changes)
  const navCatalog = useSyncExternalStore(
    navStore.subscribe.bind(navStore),
    navStore.getSnapshot.bind(navStore),
    navStore.getSnapshot.bind(navStore)
  )

  // Current loaded group state
  const [currentGroupId, setCurrentGroupId] = useState<string>('')
  const [currentGroup, setCurrentGroup] = useState<Group | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  // Ref for deduplicating concurrent load requests
  const loadingRef = useRef<string | null>(null)

  /**
   * Loads a group by ID.
   * If already cached, returns immediately from cache.
   * If already loading the same group, waits for existing request.
   */
  const loadGroup = useCallback(
    async (groupId: string): Promise<void> => {
      // Skip if already loaded this group
      if (currentGroupId === groupId && currentGroup) {
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
    },
    [currentGroupId, currentGroup]
  )

  /**
   * Checks if a group is already cached.
   */
  const checkIsCached = useCallback((groupId: string): boolean => {
    return isGroupCached(groupId)
  }, [])

  return useMemo(
    () => ({
      navCatalog,
      currentGroup,
      isLoading,
      error,
      loadGroup,
      isGroupCached: checkIsCached,
    }),
    [navCatalog, currentGroup, isLoading, error, loadGroup, checkIsCached]
  )
}
