import { animationDataService } from '@/services/animationData'
import type { Category } from '@/types/animation'
import { useCallback, useEffect, useRef, useState } from 'react'

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
  const isMountedRef = useRef(true)
  const latestRequestIdRef = useRef(0)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const runCatalogRequest = useCallback(async (requestFactory: () => Promise<Category[]>) => {
    const requestId = ++latestRequestIdRef.current

    if (isMountedRef.current) {
      setLoadingState({ isLoading: true, error: null })
    }

    try {
      const data = await requestFactory()

      if (!isMountedRef.current || requestId !== latestRequestIdRef.current) {
        return
      }

      setCategories(data)
      setLoadingState({ isLoading: false, error: null })
    } catch (error) {
      if (!isMountedRef.current || requestId !== latestRequestIdRef.current) {
        return
      }

      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load animations',
      })
    }
  }, [])

  const loadCatalog = useCallback(async () => {
    await runCatalogRequest(() => animationDataService.loadAnimations())
  }, [runCatalogRequest])

  useEffect(() => {
    void loadCatalog()
  }, [loadCatalog])

  const refreshAnimations = useCallback(async () => {
    await runCatalogRequest(() => animationDataService.refreshCatalog())
  }, [runCatalogRequest])

  return {
    categories,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    refreshAnimations,
  }
}
