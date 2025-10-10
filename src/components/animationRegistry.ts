import type { CategoryExport } from '@/types/animation'
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
 *
 * @returns A map of animation IDs to their React components
 */
export function buildRegistryFromCategories() {
  const registry: Record<string, React.ComponentType<Record<string, unknown>>> = {}
  Object.values(categories).forEach((cat) => {
    Object.values(cat.groups).forEach((group) => {
      Object.entries(group.animations).forEach(([id, anim]) => {
        registry[id] = anim.component
      })
    })
  })
  return registry
}

/**
 * Retrieves metadata for a specific animation by its ID.
 *
 * @param animationId - The unique animation ID (e.g., 'modal-base__scale-gentle-pop')
 * @returns The animation's metadata, or null if not found
 */
export function getAnimationMetadata(animationId: string) {
  for (const cat of Object.values(categories)) {
    for (const group of Object.values(cat.groups)) {
      if (group.animations[animationId]) {
        return group.animations[animationId].metadata
      }
    }
  }
  return null
}
