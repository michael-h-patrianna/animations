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
 * @param {(groupId: string, options?: { replace?: boolean }) => void} params.navigateToGroup - Router navigation callback
 *
 * @example
 * ```tsx
 * const [currentGroupId, setCurrentGroupId] = useState('')
 * const { groupId } = useParams()
 * const allGroups = categories.flatMap((c) => c.groups)
 * const navigate = useNavigate()
 *
 * useGroupInitialization({
 *   allGroups,
 *   groupId,
 *   currentGroupId,
 *   setCurrentGroupId,
 *   navigateToGroup: (id, options) => navigate(`/${id}`, options)
 * })
 * ```
 *
 * @remarks
 * - Uses router navigation callback for canonical redirects (no hard reload)
 * - Canonicalizes base group names to '-framer', then '-css', then first group
 * - Falls back to first group for invalid/missing route params
 */
export function useGroupInitialization({
  allGroups,
  groupId,
  currentGroupId,
  setCurrentGroupId,
  navigateToGroup,
}: {
  allGroups: Group[]
  groupId: string | undefined
  currentGroupId: string
  setCurrentGroupId: (groupId: string) => void
  navigateToGroup: (groupId: string, options?: { replace?: boolean }) => void
}) {
  useEffect(() => {
    if (allGroups.length === 0) return

    const hasGroup = (candidateId: string) => allGroups.some((g) => g.id === candidateId)
    const firstGroupId = allGroups[0].id

    if (groupId && hasGroup(groupId)) {
      // URL has a valid groupId
      if (currentGroupId !== groupId) {
        setCurrentGroupId(groupId)
      }
      return
    }

    if (groupId && !groupId.endsWith('-framer') && !groupId.endsWith('-css')) {
      // URL has a group name without -framer or -css suffix, canonicalize to framer, css, or first
      const framerGroupId = `${groupId}-framer`
      const cssGroupId = `${groupId}-css`
      const canonicalGroupId = hasGroup(framerGroupId)
        ? framerGroupId
        : hasGroup(cssGroupId)
          ? cssGroupId
          : firstGroupId

      if (currentGroupId !== canonicalGroupId) {
        setCurrentGroupId(canonicalGroupId)
      }

      if (groupId !== canonicalGroupId) {
        navigateToGroup(canonicalGroupId, { replace: true })
      }

      return
    }

    // No URL param or invalid, default to first group and canonicalize route
    if (currentGroupId !== firstGroupId) {
      setCurrentGroupId(firstGroupId)
    }
    if (groupId !== firstGroupId) {
      navigateToGroup(firstGroupId, { replace: true })
    }
  }, [allGroups, groupId, currentGroupId, setCurrentGroupId, navigateToGroup])
}
