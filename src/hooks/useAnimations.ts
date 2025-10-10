import { animationDataService } from '@/services/animationData'
import { useCodeMode } from '@/contexts/CodeModeContext'
import type { Category } from '@/types/animation'
import { useCallback, useEffect, useState } from 'react'

interface LoadingState {
  isLoading: boolean
  error: string | null
}

export function useAnimations() {
  const { codeMode } = useCodeMode()
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  })

  const loadCatalog = useCallback(async () => {
    try {
      setLoadingState({ isLoading: true, error: null })
      const data = await animationDataService.loadAnimations(codeMode)
      setCategories(data)
      setLoadingState({ isLoading: false, error: null })
    } catch (error) {
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load animations',
      })
    }
  }, [codeMode])

  useEffect(() => {
    loadCatalog()
  }, [loadCatalog])

  const refreshAnimations = async () => {
    try {
      setLoadingState({ isLoading: true, error: null })
      const data = await animationDataService.refreshCatalog(codeMode)
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
