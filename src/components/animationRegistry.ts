import type { AnimationExport, CategoryExport } from '@/types/animation'
import type React from 'react'

// Import category exports for metadata-based access
import { categoryExport as baseCategory } from '@/components/base'
import { categoryExport as dialogsCategory } from '@/components/dialogs'
import { categoryExport as progressCategory } from '@/components/progress'
import { categoryExport as realtimeCategory } from '@/components/realtime'
import { categoryExport as rewardsCategory } from '@/components/rewards'

// ============================================================================
// Category-based Registry
// ============================================================================

/**
 * Category-based registry with full metadata support.
 * Each category contains groups, and each group contains animations with their metadata.
 */
export const categories: Record<string, CategoryExport> = {
  base: baseCategory,
  dialogs: dialogsCategory,
  progress: progressCategory,
  realtime: realtimeCategory,
  rewards: rewardsCategory,
}

/**
 * Builds a flat animation registry from the category hierarchy.
 * Iterates Framer entries first, then CSS, per group. When both variants
 * share the same animation ID (the normal case for dual-implementation
 * animations), the CSS entry overwrites the Framer entry (last-write-wins).
 *
 * This flat registry is used by consumers that need a single component per
 * animation ID regardless of tech variant. For tech-specific lookups, use
 * {@link getGroupAnimations} instead.
 *
 * @returns A map of animation IDs to their React components (CSS wins on overlap)
 */
export function buildRegistryFromCategories() {
  const registry: Record<string, React.ComponentType<Record<string, unknown>>> = {}

  Object.values(categories).forEach((cat) => {
    Object.values(cat.groups).forEach((group) => {
      Object.entries(group.framer).forEach(([id, anim]) => {
        registry[id] = anim.component
      })
      Object.entries(group.css).forEach(([id, anim]) => {
        registry[id] = anim.component
      })
    })
  })
  return registry
}

/**
 * Returns the AnimationExport map for a specific group and tech variant.
 * Encapsulates category traversal so consumers don't need to know the hierarchy.
 */
export function getGroupAnimations(
  baseGroupId: string,
  tech: 'framer' | 'css'
): Record<string, AnimationExport> {
  for (const category of Object.values(categories)) {
    const group = category.groups[baseGroupId]
    if (group) {
      return tech === 'css' ? group.css : group.framer
    }
  }
  return {}
}
