import { buildCatalog } from '@/services/animationData'
import type { Category } from '@/types/animation'
import { useMemo } from 'react'

/**
 * Hook for loading the animation catalog.
 *
 * The catalog is built synchronously from static imports — there is no async
 * data fetching, so no loading or error states are needed. The ErrorBoundary
 * at the app root handles any unexpected runtime errors.
 *
 * @returns {{ categories: Category[] }} The complete animation catalog
 */
export function useAnimations(): { categories: Category[] } {
  const categories = useMemo<Category[]>(() => buildCatalog(), [])
  return { categories }
}
