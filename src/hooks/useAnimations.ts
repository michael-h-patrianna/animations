import { animationDataService } from '@/services/animationData';
import type { Category, LoadingState } from '@/types/animation';
import { useCallback, useEffect, useState } from 'react';

export function useAnimations() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null
  });

  const loadCatalog = useCallback(async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      const data = await animationDataService.loadAnimations();
      setCategories(data);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load animations'
      });
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const refreshAnimations = async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      const data = await animationDataService.refreshCatalog();
      setCategories(data);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh animations'
      });
    }
  };

  return {
    categories,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    refreshAnimations
  };
}
