import '@/components/lazyBootstrap'
import {
  clearGroupCache,
  findLazyGroup,
  getAllLazyGroups,
  getLoadedGroupAnimations,
  getLazyNavCatalog,
  loadLazyGroup,
} from '@/lib/lazyGroupRegistry'
import type { AnimationExport, CategoryExport } from '@/types/animation'
import type React from 'react'

// ============================================================================
// Lazy-First Registry (New Pattern)
// ============================================================================

/**
 * Gets the lightweight navigation catalog for sidebar rendering.
 * This contains only metadata - no actual animation code.
 * Safe to call synchronously; always returns immediately.
 */
export function getNavCatalog() {
  return getLazyNavCatalog()
}

/**
 * Gets all lazy groups for navigation purposes.
 */
export function getAllGroups() {
  return getAllLazyGroups()
}

// ============================================================================
// Lazy Group Data Access
// ============================================================================

/** Cache of loaded group exports to avoid redundant async calls */
const groupExportCache = new Map<string, Promise<Record<string, AnimationExport>>>()

/**
 * Gets animation exports for a specific group and tech variant.
 * Loads the group if not already cached.
 *
 * This is the primary API for accessing animation data.
 */
export async function getLazyGroupAnimationsAsync(
  baseGroupId: string,
  tech: 'framer' | 'css'
): Promise<Record<string, AnimationExport>> {
  const groupId = `${baseGroupId}-${tech}`

  const loaded = getLoadedGroupAnimations(groupId)
  if (Object.keys(loaded).length > 0) {
    return loaded
  }

  // Check if already loading/cached
  const cached = groupExportCache.get(groupId)
  if (cached) {
    return cached
  }

  // Check if lazy group is registered
  const lazyGroup = findLazyGroup(groupId)
  if (!lazyGroup) {
    return {}
  }

  // Start loading
  const promise = loadLazyGroup(groupId)
    .then((result) => result.animations)
    .catch((error) => {
      // Remove from cache on error so we can retry
      groupExportCache.delete(groupId)
      throw error
    })

  groupExportCache.set(groupId, promise)
  return promise
}

/**
 * Synchronous version - returns empty object if not loaded yet.
 * Used by components that need to check current state without triggering loads.
 */
export function getLazyGroupAnimationsSync(
  baseGroupId: string,
  tech: 'framer' | 'css'
): Record<string, AnimationExport> {
  const groupId = `${baseGroupId}-${tech}`
  return getLoadedGroupAnimations(groupId)
}

// ============================================================================
// Backward Compatibility Layer
// ============================================================================

/**
 * Category-based registry with full metadata support (LEGACY).
 *
 * @deprecated This is now a lazy-loading compatibility layer.
 * The eager imports have been replaced with lazy loading.
 * Use getNavCatalog() and loadLazyGroup() for new code.
 */
export const categories: Record<string, CategoryExport> = {}

/**
 * Builds a flat animation registry from the category hierarchy (LEGACY).
 *
 * @deprecated Use getNavCatalog() and loadLazyGroup() instead.
 * This function now returns an empty registry - animation data is lazy-loaded.
 */
export function buildRegistryFromCategories() {
  const registry: Record<string, React.ComponentType<Record<string, unknown>>> = {}
  for (const group of getAllLazyGroups()) {
    const loaded = getLoadedGroupAnimations(group.id)
    for (const [id, anim] of Object.entries(loaded)) {
      registry[id] = anim.component
    }
  }
  return registry
}

/**
 * Returns the AnimationExport map for a specific group and tech variant (COMPATIBILITY).
 *
 * This function provides synchronous compatibility with the old API
 * by returning empty object immediately. The actual data is loaded
 * asynchronously by the lazy loading system.
 *
 * For new code, use getLazyGroupAnimationsAsync() instead.
 *
 * @param baseGroupId - Base group ID without tech suffix (e.g., 'modal-base')
 * @param tech - Technology variant ('framer' or 'css')
 * @returns AnimationExport map (empty if not yet loaded)
 */
export function getGroupAnimations(
  baseGroupId: string,
  tech: 'framer' | 'css'
): Record<string, AnimationExport> {
  const groupId = `${baseGroupId}-${tech}`
  return getLoadedGroupAnimations(groupId)
}

/**
 * Looks up an animation ID across all categories and groups (COMPATIBILITY).
 *
 * @deprecated Use the lazy navigation catalog instead.
 * This function now searches the lazy group metadata.
 */
export function findAnimationById(
  animationId: string
): { baseGroupId: string; hasFramer: boolean; hasCss: boolean } | null {
  // Search through lazy groups
  const allGroups = getAllLazyGroups()

  for (const group of allGroups) {
    const loadedAnimations = getLoadedGroupAnimations(group.id)
    if (group.animationIds.includes(animationId) || animationId in loadedAnimations) {
      // Check if both variants exist
      const framerId = `${group.baseGroupId}-framer`
      const cssId = `${group.baseGroupId}-css`

      const hasFramer = allGroups.some((g) => g.id === framerId)
      const hasCss = allGroups.some((g) => g.id === cssId)

      return {
        baseGroupId: group.baseGroupId,
        hasFramer,
        hasCss,
      }
    }
  }

  return null
}

// ============================================================================
// Eager Loading Registration (For Tests/SSR)
// ============================================================================

/**
 * Preloads all groups into cache.
 * Useful for testing or SSR scenarios where you want all data available.
 */
export async function preloadAllGroups(): Promise<void> {
  const allGroups = getAllLazyGroups()
  await Promise.all(allGroups.map((g) => loadLazyGroup(g.id)))
}

/**
 * Clears all cached group data.
 * Useful for testing.
 */
export function clearAnimationCache(): void {
  groupExportCache.clear()
  clearGroupCache()
}
