import { animationDataService } from '@/services/animationData'
import type { Category } from '@/types/animation'
import { useCallback, useEffect, useState } from 'react'

interface LoadingState {
  isLoading: boolean
  error: string | null
}

/**
 * Hook for loading and managing the animation catalog.
 *
 * Loads the complete animation catalog from the animation data service on mount,
 * with support for refreshing the catalog on demand. The hook manages loading state
 * and error handling internally, providing a simple interface for consuming components.
 *
 * @returns {Object} Animation catalog state and controls
 * @returns {Category[]} categories - Array of animation categories, each containing groups and animations
 * @returns {boolean} isLoading - True while animations are being loaded or refreshed
 * @returns {string | null} error - Error message if loading failed, null otherwise
 * @returns {() => Promise<void>} refreshAnimations - Function to manually refresh the catalog
 *
 * @example
 * ```tsx
 * function AnimationCatalog() {
 *   const { categories, isLoading, error, refreshAnimations } = useAnimations();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} onRetry={refreshAnimations} />;
 *
 *   return (
 *     <div>
 *       {categories.map(category => (
 *         <CategorySection key={category.id} category={category} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Automatically loads animations on mount
 * - Uses animationDataService for data loading with caching
 * - Error handling includes user-friendly error messages
 * - Refresh mechanism clears cache and reloads data
 */
export function useAnimations() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  })

  const loadCatalog = useCallback(async () => {
    try {
      setLoadingState({ isLoading: true, error: null })
      const data = await animationDataService.loadAnimations()
      setCategories(data)
      setLoadingState({ isLoading: false, error: null })
    } catch (error) {
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load animations',
      })
    }
  }, [])

  useEffect(() => {
    loadCatalog()
  }, [loadCatalog])

  const refreshAnimations = async () => {
    try {
      setLoadingState({ isLoading: true, error: null })
      const data = await animationDataService.refreshCatalog()
      setCategories(data)
      setLoadingState({ isLoading: false, error: null })
    } catch (error) {
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh animations',
      })
    }
  }

  return {
    categories,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    refreshAnimations,
  }
}
