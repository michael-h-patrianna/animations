import type {
  Animation,
  AnimationExport,
  Group,
  GroupExport,
  GroupMetadata,
} from '@/types/animation'
import { asAnimationId, asCategoryId, asGroupVariantId } from '@/types/animation'
import type { CategoryId, GroupVariantId } from '@/types/animation'
import type {
  GroupCacheEntry,
  LazyCategory,
  LazyGroup,
  LazyGroupLoader,
  LazyGroupResult,
  LazyNavCatalog,
} from '@/types/lazy'
import { logger } from '@/services/logger'

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
function registerLazyGroup(groupId: string, loader: LazyGroupLoader): void {
  if (loaderRegistry.has(groupId)) {
    if (import.meta.env.DEV) {
      logger.warn(`[lazyGroupRegistry] Duplicate registration for group "${groupId}" — ignored`)
    }
    return
  }
  loaderRegistry.set(groupId, loader)
}


/**
 * Registers a category with its groups in one call.
 * Convenience method for category index files.
 *
 * @param categoryId - Category ID
 * @param categoryTitle - Display title
 * @param groups - Array of lazy group definitions
 */
function registerLazyCategory(
  categoryId: string,
  categoryTitle: string,
  groups: Array<{
    id: string
    title?: string
    tech: 'framer' | 'css'
    baseGroupId: string
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

function formatGroupDisplayTitle(baseTitle: string, tech: 'framer' | 'css'): string {
  return `${baseTitle} (${tech === 'framer' ? 'Framer' : 'CSS'})`
}

// ============================================================================
// Builder Helpers
// ============================================================================

/**
 * Converts AnimationExport map to Animation array for Group construction.
 */
function exportsToAnimations(
  exports: Record<string, AnimationExport>,
  categoryId: CategoryId,
  groupId: GroupVariantId,
  baseGroupId: string
): Animation[] {
  return Object.values(exports)
    .sort((a, b) => (a.metadata.order ?? 0) - (b.metadata.order ?? 0))
    .map((anim) => {
      const encodedId = encodeURIComponent(anim.metadata.id)
      return {
        id: asAnimationId(anim.metadata.id),
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
function buildGroupFromExports(
  metadata: GroupMetadata,
  tech: 'framer' | 'css',
  exports: Record<string, AnimationExport>,
  categoryId: CategoryId
): Group {
  const groupId = asGroupVariantId(`${metadata.id}-${tech}`)
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
// Declarative Registration
// ============================================================================

/** Group definition for declareCategoryGroups. */
interface GroupDefinition {
  /** Group metadata (id, title, demo). */
  metadata: GroupMetadata
  /**
   * Thunk returning the dynamic import of the group's index module.
   * Must be a literal `() => import('./group-name')` for Vite static analysis.
   */
  load: () => Promise<{ groupExport: GroupExport }>
}

/**
 * Registers all groups in a category with a single declarative call.
 * Creates both framer and css lazy loaders, plus the nav metadata.
 *
 * @param categoryId - Category identifier (e.g., 'rewards')
 * @param categoryTitle - Human-readable category title
 * @param groups - Group definitions with metadata and import thunks
 *
 * @example
 * ```typescript
 * declareCategoryGroups('rewards', 'Game Elements & Rewards', [
 *   { metadata: collectionEffectsMeta, load: () => import('./collection-effects') },
 *   { metadata: lightsMeta, load: () => import('./lights') },
 * ])
 * ```
 */
export function declareCategoryGroups(
  categoryId: string,
  categoryTitle: string,
  groups: GroupDefinition[]
): void {
  const brandedCategoryId = asCategoryId(categoryId)

  for (const { metadata, load } of groups) {
    const baseId = metadata.id

    for (const tech of ['framer', 'css'] as const) {
      const groupId = `${baseId}-${tech}`
      registerLazyGroup(groupId, async () => {
        const { groupExport } = await load()
        const animations = tech === 'framer' ? groupExport.framer : groupExport.css
        const group = buildGroupFromExports(
          groupExport.metadata,
          tech,
          animations,
          brandedCategoryId
        )
        return { metadata: groupExport.metadata, animations, group }
      })
    }
  }

  registerLazyCategory(
    categoryId,
    categoryTitle,
    groups.flatMap(({ metadata }) => [
      {
        id: `${metadata.id}-framer`,
        title: `${metadata.title} (Framer)`,
        tech: 'framer' as const,
        baseGroupId: metadata.id,
        metadata,
      },
      {
        id: `${metadata.id}-css`,
        title: `${metadata.title} (CSS)`,
        tech: 'css' as const,
        baseGroupId: metadata.id,
        metadata,
      },
    ])
  )
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

