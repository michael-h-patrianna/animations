import type { Group } from '@/types/animation'
import { useEffect } from 'react'

/**
 * Hook to initialize and synchronize the current group from URL parameters.
 *
 * Handles three scenarios:
 * 1. Valid groupId in URL → Sets as current group
 * 2. Base group name without suffix → Redirects to -framer variant
 * 3. No/invalid URL param → Redirects to first available group
 *
 * @param {Object} params - Hook parameters
 * @param {Group[]} params.allGroups - All available animation groups
 * @param {string | undefined} params.groupId - Group ID from URL params
 * @param {string} params.currentGroupId - Currently selected group ID
 * @param {(groupId: string) => void} params.setCurrentGroupId - State setter for current group
 *
 * @example
 * ```tsx
 * const [currentGroupId, setCurrentGroupId] = useState('')
 * const { groupId } = useParams()
 * const allGroups = categories.flatMap((c) => c.groups)
 *
 * useGroupInitialization({
 *   allGroups,
 *   groupId,
 *   currentGroupId,
 *   setCurrentGroupId
 * })
 * ```
 *
 * @remarks
 * - Uses window.location.href for redirects to ensure clean URL updates
 * - Automatically appends '-framer' suffix for base group names
 * - Falls back to first group if requested group doesn't exist
 */
export function useGroupInitialization({
  allGroups,
  groupId,
  currentGroupId,
  setCurrentGroupId,
}: {
  allGroups: Group[]
  groupId: string | undefined
  currentGroupId: string
  setCurrentGroupId: (groupId: string) => void
}) {
  useEffect(() => {
    if (allGroups.length === 0) return

    if (groupId && allGroups.some((g) => g.id === groupId)) {
      // URL has a valid groupId
      setCurrentGroupId(groupId)
    } else if (groupId && !groupId.endsWith('-framer') && !groupId.endsWith('-css')) {
      // URL has a group name without -framer or -css suffix, redirect to -framer
      const framerGroupId = `${groupId}-framer`
      if (allGroups.some((g) => g.id === framerGroupId)) {
        window.location.href = `/${framerGroupId}`
      } else if (!currentGroupId) {
        // Framer version doesn't exist, default to first group
        const firstGroupId = allGroups[0].id
        setCurrentGroupId(firstGroupId)
        window.location.href = `/${firstGroupId}`
      }
    } else if (!currentGroupId) {
      // No URL param or invalid, default to first group
      const firstGroupId = allGroups[0].id
      setCurrentGroupId(firstGroupId)
      window.location.href = `/${firstGroupId}`
    }
  }, [allGroups, groupId, currentGroupId, setCurrentGroupId])
}
