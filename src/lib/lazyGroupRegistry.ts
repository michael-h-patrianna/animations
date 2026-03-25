import type { Animation, AnimationExport, Group, GroupMetadata } from '@/types/animation'
import type {
  GroupCacheEntry,
  LazyCategory,
  LazyGroup,
  LazyGroupLoader,
  LazyGroupResult,
  LazyNavCatalog,
} from '@/types/lazy'

// ============================================================================
// Registry Storage
// ============================================================================

/** Map of registered lazy group loaders */
const loaderRegistry = new Map<string, LazyGroupLoader>()

/** Map of registered navigation metadata */
const navMetadataRegistry = new Map<string, LazyGroup>()

/** Cache of loaded groups */
const groupCache = new Map<string, GroupCacheEntry>()

/** Registered categories in order */
const categoriesList: LazyCategory[] = []

// ============================================================================
// Registration API
// ============================================================================

/**
 * Registers a lazy loader for a group variant.
 * Called by category index files during module initialization.
 *
 * @param groupId - Full group ID with tech suffix (e.g., 'modal-base-framer')
 * @param loader - Async function that loads the group's code
 *
 * @example
 * ```typescript
 * registerLazyGroup('collection-effects-framer', () =>
 *   import('./collection-effects/framer').then(m => m.loadGroup())
 * )
 * ```
 */
export function registerLazyGroup(groupId: string, loader: LazyGroupLoader): void {
  if (loaderRegistry.has(groupId)) {
    // Silently ignore duplicate registrations in production
    // In dev, this might indicate a configuration issue
    return
  }
  loaderRegistry.set(groupId, loader)
}

/**
 * Registers navigation metadata for a lazy group.
 * This lightweight data is included in the main bundle for nav rendering.
 *
 * @param group - Lazy group metadata
 */
export function registerLazyNavMetadata(group: LazyGroup): void {
  navMetadataRegistry.set(group.id, group)

  // Add to categories list
  let category = categoriesList.find((c) => c.id === group.categoryId)
  if (!category) {
    category = {
      id: group.categoryId,
      title: getCategoryTitle(group.categoryId),
      groups: [],
    }
    categoriesList.push(category)
  }

  // Avoid duplicates
  if (!category.groups.find((g) => g.id === group.id)) {
    category.groups.push(group)
  }
}

/**
 * Registers a category with its groups in one call.
 * Convenience method for category index files.
 *
 * @param categoryId - Category ID
 * @param categoryTitle - Display title
 * @param groups - Array of lazy group definitions
 */
export function registerLazyCategory(
  categoryId: string,
  categoryTitle: string,
  groups: Array<{
    id: string
    title?: string
    tech: 'framer' | 'css'
    baseGroupId: string
    animationIds: string[]
    metadata: GroupMetadata
  }>
): void {
  // Check if category already exists
  let category = categoriesList.find((c) => c.id === categoryId)
  if (!category) {
    category = {
      id: categoryId,
      title: categoryTitle,
      groups: [],
    }
    categoriesList.push(category)
  }

  for (const groupDef of groups) {
    const lazyGroup: LazyGroup = {
      id: groupDef.id,
      title: formatGroupDisplayTitle(groupDef.metadata.title, groupDef.tech),
      tech: groupDef.tech,
      baseGroupId: groupDef.baseGroupId,
      categoryId,
      animationIds: groupDef.animationIds,
      metadata: groupDef.metadata,
    }
    navMetadataRegistry.set(groupDef.id, lazyGroup)

    // Avoid duplicates
    if (!category.groups.find((g) => g.id === groupDef.id)) {
      category.groups.push(lazyGroup)
    }
  }
}

// ============================================================================
// Loading API
// ============================================================================

/**
 * Loads a group by ID, with caching.
 * Returns the cached result if already loaded.
 *
 * @param groupId - Full group ID with tech suffix
 * @returns Promise resolving to the loaded group result
 * @throws Error if no loader registered for the group
 */
export async function loadLazyGroup(groupId: string): Promise<LazyGroupResult> {
  // Check cache first
  const cached = groupCache.get(groupId)
  if (cached?.result) {
    return cached.result
  }

  // If already loading, return the existing promise
  if (cached?.promise) {
    return cached.promise
  }

  // Get the loader
  const loader = loaderRegistry.get(groupId)
  if (!loader) {
    throw new Error(`[lazyGroupRegistry] No loader registered for "${groupId}"`)
  }

  // Start loading
  const promise = loader()
    .then((result) => {
      const entry = groupCache.get(groupId)
      if (entry) {
        entry.result = result
        entry.loadedAt = Date.now()
      }
      return result
    })
    .catch((error) => {
      const entry = groupCache.get(groupId)
      if (entry) {
        entry.error = error instanceof Error ? error : new Error(String(error))
      }
      throw error
    })

  groupCache.set(groupId, { promise })
  return promise
}

/**
 * Preloads a group into cache without waiting for the result.
 * Useful for predictive loading (e.g., on hover).
 *
 * @param groupId - Full group ID with tech suffix
 */
export function preloadLazyGroup(groupId: string): void {
  if (groupCache.has(groupId)) return

  const loader = loaderRegistry.get(groupId)
  if (!loader) return

  // Fire and forget - populate cache
  void loadLazyGroup(groupId)
}

/**
 * Checks if a group is already cached (loaded or loading).
 *
 * @param groupId - Full group ID with tech suffix
 */
export function isGroupCached(groupId: string): boolean {
  return groupCache.has(groupId)
}

/**
 * Checks if a group has been fully loaded (not just loading).
 *
 * @param groupId - Full group ID with tech suffix
 */
export function isGroupLoaded(groupId: string): boolean {
  const cached = groupCache.get(groupId)
  return cached?.result !== undefined
}

/**
 * Gets the loading error for a group if one occurred.
 *
 * @param groupId - Full group ID with tech suffix
 */
export function getGroupError(groupId: string): Error | undefined {
  return groupCache.get(groupId)?.error
}

/**
 * Gets the loaded animation exports for a group if available.
 * Returns an empty object when the group has not been loaded yet.
 */
export function getLoadedGroupAnimations(groupId: string): Record<string, AnimationExport> {
  return groupCache.get(groupId)?.result?.animations ?? {}
}

// ============================================================================
// Navigation Catalog API
// ============================================================================

/**
 * Gets the lightweight navigation catalog.
 * This contains only metadata - no actual animation code.
 * Safe to call synchronously; always returns immediately.
 */
export function getLazyNavCatalog(): LazyNavCatalog {
  return {
    categories: [...categoriesList],
    groupMap: Object.fromEntries(navMetadataRegistry.entries()),
  }
}

/**
 * Gets a flat list of all lazy groups.
 */
export function getAllLazyGroups(): LazyGroup[] {
  return [...navMetadataRegistry.values()]
}

/**
 * Finds a lazy group by ID.
 *
 * @param groupId - Full group ID with tech suffix
 */
export function findLazyGroup(groupId: string): LazyGroup | undefined {
  return navMetadataRegistry.get(groupId)
}

// ============================================================================
// Helper Functions
// ============================================================================

/** Maps category IDs to their default titles */
function getCategoryTitle(categoryId: string): string {
  const titles: Record<string, string> = {
    base: 'Base Effects',
    dialogs: 'Dialog & Modal Animations',
    progress: 'Progress & Loading Animations',
    realtime: 'Real-time Updates & Timers',
    rewards: 'Game Elements & Rewards',
  }
  return titles[categoryId] || categoryId
}

function formatGroupDisplayTitle(baseTitle: string, tech: 'framer' | 'css'): string {
  return `${baseTitle} (${tech === 'framer' ? 'Framer' : 'CSS'})`
}

// ============================================================================
// Builder Helpers
// ============================================================================

/**
 * Converts AnimationExport map to Animation array for Group construction.
 * Mirrors the logic in animationData.ts.
 */
export function exportsToAnimations(
  exports: Record<string, AnimationExport>,
  categoryId: string,
  groupId: string,
  baseGroupId: string
): Animation[] {
  return Object.values(exports)
    .sort((a, b) => (a.metadata.order ?? 0) - (b.metadata.order ?? 0))
    .map((anim) => {
      const encodedId = encodeURIComponent(anim.metadata.id)
      return {
        id: anim.metadata.id,
        title: anim.metadata.title,
        description: anim.metadata.description,
        categoryId,
        groupId,
        urlSlugFramer: `/${baseGroupId}-framer?animation=${encodedId}`,
        urlSlugCss: `/${baseGroupId}-css?animation=${encodedId}`,
        disableReplay: anim.metadata.disableReplay,
        infinite: anim.metadata.infinite,
        controls: anim.metadata.controls,
        prizeCountMax: anim.metadata.prizeCountMax,
        previewPosition: anim.metadata.previewPosition,
        tier: anim.metadata.tier,
        demoMode: anim.metadata.demoMode,
        previewMaxWidth: anim.metadata.previewMaxWidth,
        props: anim.metadata.props,
      }
    })
}

/**
 * Builds a Group object from metadata and animation exports.
 */
export function buildGroupFromExports(
  metadata: GroupMetadata,
  tech: 'framer' | 'css',
  exports: Record<string, AnimationExport>,
  categoryId: string
): Group {
  const groupId = `${metadata.id}-${tech}`
  const animations = exportsToAnimations(exports, categoryId, groupId, metadata.id)

  return {
    id: groupId,
    title: formatGroupDisplayTitle(metadata.title, tech),
    tech,
    demo: metadata.demo,
    animations,
  }
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Clears all cached groups. Useful for testing or memory management.
 */
export function clearGroupCache(): void {
  groupCache.clear()
}

/**
 * Gets cache statistics for debugging.
 */
export function getCacheStats(): {
  total: number
  loaded: number
  loading: number
  errors: number
} {
  let loaded = 0
  let loading = 0
  let errors = 0

  for (const entry of groupCache.values()) {
    if (entry.error) errors++
    else if (entry.result) loaded++
    else loading++
  }

  return {
    total: groupCache.size,
    loaded,
    loading,
    errors,
  }
}
