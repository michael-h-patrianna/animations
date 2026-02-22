import type { CodeMode } from '@/contexts/CodeModeContext'
import { useGroupInitialization } from '@/hooks/useGroupInitialization'
import type { Category, Group } from '@/types/animation'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/**
 *
 */
export function useAppNavigation(categories: Category[]) {
  const { groupId } = useParams<{ groupId?: string }>()
  const navigate = useNavigate()
  const [currentGroupId, setCurrentGroupId] = useState<string>('')

  const allGroups: Group[] = categories.flatMap((category) => category.groups)

  const navigateToGroup = useCallback(
    (id: string, options?: { replace?: boolean }) => {
      navigate(`/${id}`, options)
    },
    [navigate]
  )

  useGroupInitialization({
    allGroups,
    groupId,
    currentGroupId,
    setCurrentGroupId,
    navigateToGroup,
  })

  const handleModeSelect = useCallback(
    (mode: CodeMode) => {
      if (!currentGroupId) return
      const baseId = currentGroupId.replace(/-(?:framer|css)$/, '')
      const targetId = mode === 'CSS' ? `${baseId}-css` : `${baseId}-framer`
      const exists = allGroups.some((g) => g.id === targetId)
      if (exists && targetId !== currentGroupId) {
        navigateToGroup(targetId)
      }
    },
    [currentGroupId, allGroups, navigateToGroup]
  )

  const handleGroupSelect = useCallback(
    (gId: string) => {
      if (gId === currentGroupId) return
      navigateToGroup(gId)
    },
    [currentGroupId, navigateToGroup]
  )

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId)
      if (category && category.groups.length > 0) {
        handleGroupSelect(category.groups[0].id)
      }
    },
    [categories, handleGroupSelect]
  )

  const currentGroup = allGroups.find((g) => g.id === currentGroupId)

  return {
    allGroups,
    currentGroupId,
    currentGroup,
    handleModeSelect,
    handleGroupSelect,
    handleCategorySelect,
  }
}
