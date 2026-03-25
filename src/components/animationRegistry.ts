import '@/components/lazyBootstrap'
import {
  clearGroupCache,
  findLazyGroup,
  getAllLazyGroups,
  getLoadedGroupAnimations,
  getLazyNavCatalog,
  loadLazyGroup,
} from '@/lib/lazyGroupRegistry'
import type { AnimationExport } from '@/types/animation'

// ============================================================================
// Navigation Metadata
// ============================================================================

/**
 * Gets the lightweight navigation catalog for sidebar rendering.
 * Contains only metadata — no actual animation code.
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
// Group Data Access
// ============================================================================

/** Cache of loaded group exports to avoid redundant async calls */
const groupExportCache = new Map<string, Promise<Record<string, AnimationExport>>>()

/**
 * Gets animation exports for a specific group and tech variant.
 * Loads the group if not already cached.
 *
 * This is the primary async API for accessing animation data.
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
 * Returns the AnimationExport map for a specific group and tech variant.
 * Synchronous — returns empty object if not yet loaded.
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

// ============================================================================
// Cache Management
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
