import { findAnimationById } from '@/components/animationRegistry'
import type { Group } from '@/types/animation'
import { useEffect } from 'react'

/**
 * Hook to initialize and synchronize the current group from URL parameters.
 *
 * Handles four scenarios:
 * 1. Animation filter with no/wrong group → Redirects to the correct group with filter preserved
 * 2. Valid groupId in URL → Sets as current group
 * 3. Base group name without suffix → Redirects to -framer variant
 * 4. No/invalid URL param → Redirects to first available group
 */
export function useGroupInitialization({
  allGroups,
  groupId,
  currentGroupId,
  setCurrentGroupId,
  navigateToGroup,
  animationFilter,
}: {
  allGroups: Group[]
  groupId: string | undefined
  currentGroupId: string
  setCurrentGroupId: (groupId: string) => void
  navigateToGroup: (groupId: string, options?: { replace?: boolean; search?: string }) => void
  animationFilter: string | undefined
}) {
  useEffect(() => {
    if (allGroups.length === 0) return

    const hasGroup = (candidateId: string) => allGroups.some((g) => g.id === candidateId)
    const firstGroupId = allGroups[0]!.id

    // When an animation filter is present and the URL has no group (root path),
    // resolve the animation's group and redirect there.
    if (animationFilter && !groupId) {
      const found = findAnimationById(animationFilter)
      if (found) {
        const tech = found.hasFramer ? 'framer' : 'css'
        const targetGroupId = `${found.baseGroupId}-${tech}`
        if (hasGroup(targetGroupId)) {
          if (currentGroupId !== targetGroupId) {
            setCurrentGroupId(targetGroupId)
          }
          navigateToGroup(targetGroupId, {
            replace: true,
            search: `?animation=${encodeURIComponent(animationFilter)}`,
          })
          return
        }
      }
      // Animation not found — navigate to first group, keep the filter so GroupSection shows error
      if (currentGroupId !== firstGroupId) {
        setCurrentGroupId(firstGroupId)
      }
      navigateToGroup(firstGroupId, {
        replace: true,
        search: `?animation=${encodeURIComponent(animationFilter)}`,
      })
      return
    }

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
  }, [allGroups, groupId, currentGroupId, setCurrentGroupId, navigateToGroup, animationFilter])
}
