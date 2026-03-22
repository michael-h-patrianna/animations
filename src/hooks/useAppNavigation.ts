import type { CodeMode } from '@/contexts/CodeModeContext'
import { useCodeMode } from '@/contexts/CodeModeContext'
import { useGroupInitialization } from '@/hooks/useGroupInitialization'
import type { Category, Group } from '@/types/animation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const codeModeFromGroupId = (groupId: string): CodeMode | undefined => {
  if (groupId.endsWith('-css')) return 'CSS'
  if (groupId.endsWith('-framer')) return 'Framer'
  return undefined
}

/** Manages navigation state: group selection, category selection, and code mode switching. */
export function useAppNavigation(categories: Category[]) {
  const { groupId } = useParams<{ groupId?: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { codeMode, setCodeMode } = useCodeMode()
  const [currentGroupId, setCurrentGroupId] = useState<string>('')

  const animationFilter = searchParams.get('animation') ?? undefined

  const allGroups: Group[] = useMemo(
    () => categories.flatMap((category) => category.groups),
    [categories]
  )

  // Ref-stabilize navigate so navigateToGroup has a permanent identity.
  // react-router's navigate should be stable, but useCallback([navigate])
  // creates fragile coupling — if a future router version changes identity,
  // every effect downstream would re-fire.
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

  const navigateToGroup = useCallback(
    (id: string, options?: { replace?: boolean; search?: string }) => {
      const path = options?.search ? `/${id}${options.search}` : `/${id}`
      navigateRef.current(path, options)
    },
    []
  )

  useGroupInitialization({
    allGroups,
    groupId,
    currentGroupId,
    setCurrentGroupId,
    navigateToGroup,
    animationFilter,
  })

  // Sync CodeMode context to match the URL-derived group variant
  useEffect(() => {
    if (currentGroupId === '') return
    const urlMode = codeModeFromGroupId(currentGroupId)
    if (urlMode !== undefined && urlMode !== codeMode) {
      setCodeMode(urlMode)
    }
  }, [currentGroupId, codeMode, setCodeMode])

  const handleModeSelect = useCallback(
    (mode: CodeMode) => {
      if (currentGroupId === '') return
      const baseId = currentGroupId.replace(/-(?:framer|css)$/, '')
      const targetId = mode === 'CSS' ? `${baseId}-css` : `${baseId}-framer`
      const exists = allGroups.some((g) => g.id === targetId)
      if (exists && targetId !== currentGroupId) {
        // Preserve animation filter when switching code mode
        const search = animationFilter
          ? `?animation=${encodeURIComponent(animationFilter)}`
          : undefined
        navigateToGroup(targetId, { search })
      }
    },
    [currentGroupId, allGroups, navigateToGroup, animationFilter]
  )

  const handleGroupSelect = useCallback(
    (gId: string) => {
      if (gId === currentGroupId && !animationFilter) return
      // Sidebar navigation always strips the animation filter
      navigateToGroup(gId)
    },
    [currentGroupId, navigateToGroup, animationFilter]
  )

  const currentGroup = allGroups.find((g) => g.id === currentGroupId)

  return {
    allGroups,
    currentGroupId,
    currentGroup,
    animationFilter,
    handleModeSelect,
    handleGroupSelect,
  }
}
