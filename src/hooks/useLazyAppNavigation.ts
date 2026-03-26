import { useCodeMode } from '@/contexts/CodeModeContext'
import type { CodeMode } from '@/contexts/CodeModeContext'
import { useLazyAnimations } from '@/hooks/useLazyAnimations'
import { findLazyGroup, preloadLazyGroup } from '@/lib/lazyGroupRegistry'
import type { LazyCategory, LazyGroup } from '@/types/lazy'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const codeModeFromGroupId = (groupId: string): CodeMode | undefined => {
  if (groupId.endsWith('-css')) return 'CSS'
  if (groupId.endsWith('-framer')) return 'Framer'
  return undefined
}

/** Hook result type */
export interface LazyAppNavigationResult {
  navCategories: LazyCategory[]
  allGroups: LazyGroup[]
  currentGroupId: string
  currentGroup?: import('@/types/animation').Group
  isPending: boolean
  error?: Error
  animationFilter?: string
  handleModeSelect: (mode: CodeMode) => void
  handleGroupSelect: (groupId: string) => void
}

/** Initialize default group redirect */
function useDefaultGroupRedirect(
  groupId: string | undefined,
  allGroups: LazyGroup[],
  currentGroupId: string,
  navigateToGroup: (id: string, opts?: { replace?: boolean }) => void
): void {
  useEffect(() => {
    const hasNoGroupId = groupId === undefined || groupId === ''
    const shouldRedirect = hasNoGroupId && allGroups.length > 0 && currentGroupId === ''
    if (shouldRedirect) {
      const defaultGroup = allGroups[0]
      if (defaultGroup) navigateToGroup(defaultGroup.id, { replace: true })
    }
  }, [groupId, allGroups, currentGroupId, navigateToGroup])
}

/** Preload adjacent groups */
function usePreloadAdjacentGroups(currentGroupId: string, allGroups: LazyGroup[]): void {
  useEffect(() => {
    const hasNoGroupId = currentGroupId === ''
    if (hasNoGroupId || allGroups.length === 0) return

    const currentIndex = allGroups.findIndex((g) => g.id === currentGroupId)
    if (currentIndex === -1) return

    const nextGroup = allGroups[currentIndex + 1]
    const prevGroup = allGroups[currentIndex - 1]

    if (nextGroup) preloadLazyGroup(nextGroup.id)
    if (prevGroup) preloadLazyGroup(prevGroup.id)
  }, [currentGroupId, allGroups])
}

/** Load group and sync code mode */
function useGroupLoader(
  groupId: string | undefined,
  loadGroup: (id: string) => Promise<void>,
  setCurrentGroupId: (id: string) => void,
  setInitError: (err: Error | undefined) => void,
  codeMode: CodeMode,
  setCodeMode: (mode: CodeMode) => void
): void {
  useEffect(() => {
    const hasNoGroupId = groupId === undefined || groupId === ''
    if (hasNoGroupId) return

    const lazyGroup = findLazyGroup(groupId)
    if (!lazyGroup) {
      setInitError(new Error(`Group "${groupId}" not found`))
      return
    }

    setInitError(undefined)
    setCurrentGroupId(groupId)
    void loadGroup(groupId)

    const urlMode = codeModeFromGroupId(groupId)
    if (urlMode !== undefined && urlMode !== codeMode) {
      setCodeMode(urlMode)
    }
  }, [groupId, loadGroup, setCurrentGroupId, setInitError, codeMode, setCodeMode])
}

/** Main navigation hook with lazy loading */
export function useLazyAppNavigation(): LazyAppNavigationResult {
  const { groupId } = useParams<{ groupId?: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { codeMode, setCodeMode } = useCodeMode()

  const [currentGroupId, setCurrentGroupId] = useState('')
  const [initError, setInitError] = useState<Error | undefined>()

  const animationFilter = searchParams.get('animation') ?? undefined
  const { navCatalog, currentGroup, isPending, error: loadError, loadGroup } = useLazyAnimations()

  const error = initError || loadError

  const allGroups = useMemo(() => navCatalog.categories.flatMap((cat) => cat.groups), [navCatalog])

  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

  const navigateToGroup = useCallback(
    (id: string, options?: { replace?: boolean; search?: string }) => {
      const path = options?.search ? `/${id}${options.search}` : `/${id}`
      navigateRef.current(path, options)
    },
    []
  )

  useDefaultGroupRedirect(groupId, allGroups, currentGroupId, navigateToGroup)
  useGroupLoader(groupId, loadGroup, setCurrentGroupId, setInitError, codeMode, setCodeMode)
  usePreloadAdjacentGroups(currentGroupId, allGroups)

  const handleModeSelect = useCallback(
    (mode: CodeMode) => {
      if (currentGroupId === '') return

      const baseId = currentGroupId.replace(/-(?:framer|css)$/, '')
      const targetId = mode === 'CSS' ? `${baseId}-css` : `${baseId}-framer`

      const targetGroup = findLazyGroup(targetId)
      if (!targetGroup || targetId === currentGroupId) return

      const search = animationFilter
        ? `?animation=${encodeURIComponent(animationFilter)}`
        : undefined
      navigateToGroup(targetId, { search })
    },
    [currentGroupId, animationFilter, navigateToGroup]
  )

  const handleGroupSelect = useCallback(
    (gId: string) => {
      const isSameGroup = gId === currentGroupId && !animationFilter
      if (isSameGroup) return
      navigateToGroup(gId)
    },
    [currentGroupId, navigateToGroup, animationFilter]
  )

  return useMemo(
    () => ({
      navCategories: navCatalog.categories,
      allGroups,
      currentGroupId,
      currentGroup,
      isPending,
      error,
      animationFilter,
      handleModeSelect,
      handleGroupSelect,
    }),
    [
      navCatalog.categories,
      allGroups,
      currentGroupId,
      currentGroup,
      isPending,
      error,
      animationFilter,
      handleModeSelect,
      handleGroupSelect,
    ]
  )
}
