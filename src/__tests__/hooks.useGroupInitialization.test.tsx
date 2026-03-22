import { useGroupInitialization } from '@/hooks/useGroupInitialization'
import type { Group } from '@/types/animation'
import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

// Mock findAnimationById for animation filter tests
vi.mock('@/components/animationRegistry', () => ({
  findAnimationById: vi.fn(),
}))

import { findAnimationById } from '@/components/animationRegistry'
const mockFindAnimationById = vi.mocked(findAnimationById)

const createGroup = (id: string): Group => ({
  id,
  title: id,
  animations: [],
})

afterEach(() => {
  mockFindAnimationById.mockReset()
})

describe('hooks • useGroupInitialization', () => {
  it('syncs current group when route groupId is valid', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('alpha-framer'), createGroup('alpha-css')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: 'alpha-framer',
        currentGroupId: '',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    expect(setCurrentGroupId).toHaveBeenCalledWith('alpha-framer')
    expect(navigateToGroup).not.toHaveBeenCalled()
  })

  it('canonicalizes bare group id to framer variant when available', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('alpha-framer'), createGroup('alpha-css')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: 'alpha',
        currentGroupId: '',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    expect(setCurrentGroupId).toHaveBeenCalledWith('alpha-framer')
    expect(navigateToGroup).toHaveBeenCalledWith('alpha-framer', { replace: true })
  })

  it('falls back to css variant when framer variant is missing', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('alpha-css')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: 'alpha',
        currentGroupId: '',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    expect(setCurrentGroupId).toHaveBeenCalledWith('alpha-css')
    expect(navigateToGroup).toHaveBeenCalledWith('alpha-css', { replace: true })
  })

  it('falls back to first group for invalid route groupId', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('first-framer'), createGroup('second-css')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: 'does-not-exist-framer',
        currentGroupId: 'second-css',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    expect(setCurrentGroupId).toHaveBeenCalledWith('first-framer')
    expect(navigateToGroup).toHaveBeenCalledWith('first-framer', { replace: true })
  })

  it('does nothing when allGroups is empty', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()

    renderHook(() =>
      useGroupInitialization({
        allGroups: [],
        groupId: 'anything',
        currentGroupId: '',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    expect(setCurrentGroupId).not.toHaveBeenCalled()
    expect(navigateToGroup).not.toHaveBeenCalled()
  })

  it('does not call setCurrentGroupId when groupId already matches currentGroupId', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('alpha-framer')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: 'alpha-framer',
        currentGroupId: 'alpha-framer',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    expect(setCurrentGroupId).not.toHaveBeenCalled()
    expect(navigateToGroup).not.toHaveBeenCalled()
  })

  it('falls back to first group when groupId is undefined', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('first-framer')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: undefined,
        currentGroupId: '',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    expect(setCurrentGroupId).toHaveBeenCalledWith('first-framer')
    expect(navigateToGroup).toHaveBeenCalledWith('first-framer', { replace: true })
  })

  it('falls back to first group when groupId has -css suffix but does not exist', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('first-framer'), createGroup('second-css')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: 'does-not-exist-css',
        currentGroupId: '',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    // Has -css suffix, not in groups → falls back to first group
    expect(setCurrentGroupId).toHaveBeenCalledWith('first-framer')
    expect(navigateToGroup).toHaveBeenCalledWith('first-framer', { replace: true })
  })

  it('does not navigate when bare name canonicalizes to currentGroupId', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('alpha-framer'), createGroup('alpha-css')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: 'alpha',
        currentGroupId: 'alpha-framer',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    // Canonical is alpha-framer, which matches currentGroupId
    expect(setCurrentGroupId).not.toHaveBeenCalled()
    // But still redirects URL from 'alpha' to 'alpha-framer'
    expect(navigateToGroup).toHaveBeenCalledWith('alpha-framer', { replace: true })
  })

  it('falls back to first group when bare name has neither framer nor css variant', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('first-framer'), createGroup('second-css')]

    renderHook(() =>
      useGroupInitialization({
        allGroups: groups,
        groupId: 'nonexistent',
        currentGroupId: '',
        setCurrentGroupId,
        navigateToGroup,
      })
    )

    expect(setCurrentGroupId).toHaveBeenCalledWith('first-framer')
    expect(navigateToGroup).toHaveBeenCalledWith('first-framer', { replace: true })
  })

  it('does not fire effects when re-rendered with same props', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('alpha-framer')]

    const { rerender } = renderHook((props) => useGroupInitialization(props), {
      initialProps: {
        allGroups: groups,
        groupId: 'alpha-framer',
        currentGroupId: 'alpha-framer',
        setCurrentGroupId,
        navigateToGroup,
      },
    })

    // First render: already matching, no calls
    expect(setCurrentGroupId).not.toHaveBeenCalled()

    // Re-render with same props: should still not fire
    rerender({
      allGroups: groups,
      groupId: 'alpha-framer',
      currentGroupId: 'alpha-framer',
      setCurrentGroupId,
      navigateToGroup,
    })

    expect(setCurrentGroupId).not.toHaveBeenCalled()
    expect(navigateToGroup).not.toHaveBeenCalled()
  })

  it('handles transition from one valid group to another', () => {
    const setCurrentGroupId = vi.fn()
    const navigateToGroup = vi.fn()
    const groups = [createGroup('alpha-framer'), createGroup('beta-framer')]

    const { rerender } = renderHook((props) => useGroupInitialization(props), {
      initialProps: {
        allGroups: groups,
        groupId: 'alpha-framer',
        currentGroupId: '',
        setCurrentGroupId,
        navigateToGroup,
      },
    })

    expect(setCurrentGroupId).toHaveBeenCalledWith('alpha-framer')

    setCurrentGroupId.mockClear()
    navigateToGroup.mockClear()

    // Transition to beta
    rerender({
      allGroups: groups,
      groupId: 'beta-framer',
      currentGroupId: 'alpha-framer',
      setCurrentGroupId,
      navigateToGroup,
    })

    expect(setCurrentGroupId).toHaveBeenCalledWith('beta-framer')
    expect(navigateToGroup).not.toHaveBeenCalled() // Direct match, no redirect needed
  })

  describe('animation filter scenarios', () => {
    it('redirects to resolved group when animationFilter is present and groupId is absent', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      const groups = [createGroup('effects-framer'), createGroup('effects-css')]

      mockFindAnimationById.mockReturnValue({
        baseGroupId: 'effects',
        hasFramer: true,
        hasCss: true,
      })

      renderHook(() =>
        useGroupInitialization({
          allGroups: groups,
          groupId: undefined,
          currentGroupId: '',
          setCurrentGroupId,
          navigateToGroup,
          animationFilter: 'effects__bounce',
        })
      )

      // Should resolve to framer variant (hasFramer is checked first)
      expect(setCurrentGroupId).toHaveBeenCalledWith('effects-framer')
      expect(navigateToGroup).toHaveBeenCalledWith('effects-framer', {
        replace: true,
        search: '?animation=effects__bounce',
      })
    })

    it('redirects to css variant when animation is css-only', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      const groups = [createGroup('effects-css')]

      mockFindAnimationById.mockReturnValue({
        baseGroupId: 'effects',
        hasFramer: false,
        hasCss: true,
      })

      renderHook(() =>
        useGroupInitialization({
          allGroups: groups,
          groupId: undefined,
          currentGroupId: '',
          setCurrentGroupId,
          navigateToGroup,
          animationFilter: 'effects__css-only',
        })
      )

      expect(setCurrentGroupId).toHaveBeenCalledWith('effects-css')
      expect(navigateToGroup).toHaveBeenCalledWith('effects-css', {
        replace: true,
        search: '?animation=effects__css-only',
      })
    })

    it('falls back to first group when animationFilter references nonexistent animation', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      const groups = [createGroup('first-framer')]

      mockFindAnimationById.mockReturnValue(null)

      renderHook(() =>
        useGroupInitialization({
          allGroups: groups,
          groupId: undefined,
          currentGroupId: '',
          setCurrentGroupId,
          navigateToGroup,
          animationFilter: 'nonexistent__animation',
        })
      )

      expect(setCurrentGroupId).toHaveBeenCalledWith('first-framer')
      // Preserves the filter in the URL so GroupSection can show an error
      expect(navigateToGroup).toHaveBeenCalledWith('first-framer', {
        replace: true,
        search: '?animation=nonexistent__animation',
      })
    })

    it('encodes animation filter in URL search parameter', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      const groups = [createGroup('first-framer')]

      mockFindAnimationById.mockReturnValue(null)

      renderHook(() =>
        useGroupInitialization({
          allGroups: groups,
          groupId: undefined,
          currentGroupId: '',
          setCurrentGroupId,
          navigateToGroup,
          animationFilter: 'group__name with spaces',
        })
      )

      expect(navigateToGroup).toHaveBeenCalledWith('first-framer', {
        replace: true,
        search: '?animation=group__name%20with%20spaces',
      })
    })

    it('does not re-set currentGroupId when animationFilter resolves to already-current group', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      const groups = [createGroup('effects-framer')]

      mockFindAnimationById.mockReturnValue({
        baseGroupId: 'effects',
        hasFramer: true,
        hasCss: false,
      })

      renderHook(() =>
        useGroupInitialization({
          allGroups: groups,
          groupId: undefined,
          currentGroupId: 'effects-framer', // already on the correct group
          setCurrentGroupId,
          navigateToGroup,
          animationFilter: 'effects__bounce',
        })
      )

      // setCurrentGroupId should NOT be called since we're already there
      expect(setCurrentGroupId).not.toHaveBeenCalled()
      // But navigateToGroup IS called to update the URL
      expect(navigateToGroup).toHaveBeenCalledWith('effects-framer', {
        replace: true,
        search: '?animation=effects__bounce',
      })
    })

    it('does not use animationFilter logic when groupId is present', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      const groups = [createGroup('alpha-framer')]

      // animationFilter is set but groupId is also present
      renderHook(() =>
        useGroupInitialization({
          allGroups: groups,
          groupId: 'alpha-framer',
          currentGroupId: '',
          setCurrentGroupId,
          navigateToGroup,
          animationFilter: 'some__animation',
        })
      )

      // findAnimationById should NOT have been called — groupId takes precedence
      expect(mockFindAnimationById).not.toHaveBeenCalled()
      // Should just set the group from the URL
      expect(setCurrentGroupId).toHaveBeenCalledWith('alpha-framer')
    })

    it('falls back to first group when resolved targetGroupId is not in allGroups', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      // allGroups does NOT contain 'other-effects-framer'
      const groups = [createGroup('first-framer'), createGroup('first-css')]

      mockFindAnimationById.mockReturnValue({
        baseGroupId: 'other-effects',
        hasFramer: true,
        hasCss: false,
      })

      renderHook(() =>
        useGroupInitialization({
          allGroups: groups,
          groupId: undefined,
          currentGroupId: '',
          setCurrentGroupId,
          navigateToGroup,
          animationFilter: 'other-effects__bounce',
        })
      )

      // The resolved group 'other-effects-framer' is not in allGroups,
      // so hasGroup check fails and falls through to the fallback path
      // which navigates to first group with the filter preserved
      expect(setCurrentGroupId).toHaveBeenCalledWith('first-framer')
      expect(navigateToGroup).toHaveBeenCalledWith('first-framer', {
        replace: true,
        search: '?animation=other-effects__bounce',
      })
    })

    it('handles animationFilter with special characters that need URL encoding', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      const groups = [createGroup('first-framer')]

      mockFindAnimationById.mockReturnValue(null)

      const filterWithSpaces = 'group__animation name'

      renderHook(() =>
        useGroupInitialization({
          allGroups: groups,
          groupId: undefined,
          currentGroupId: '',
          setCurrentGroupId,
          navigateToGroup,
          animationFilter: filterWithSpaces,
        })
      )

      // Should encode the filter in the search parameter
      expect(navigateToGroup).toHaveBeenCalledWith('first-framer', {
        replace: true,
        search: `?animation=${encodeURIComponent(filterWithSpaces)}`,
      })
    })
  })

  describe('dynamic allGroups changes', () => {
    it('does not navigate when allGroups grows but currentGroupId is still valid', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()
      const initialGroups = [createGroup('alpha-framer'), createGroup('alpha-css')]

      const { rerender } = renderHook((props) => useGroupInitialization(props), {
        initialProps: {
          allGroups: initialGroups,
          groupId: 'alpha-framer',
          currentGroupId: 'alpha-framer',
          setCurrentGroupId,
          navigateToGroup,
        },
      })

      // No calls on initial render (already matching)
      expect(setCurrentGroupId).not.toHaveBeenCalled()
      expect(navigateToGroup).not.toHaveBeenCalled()

      // Add new groups — allGroups reference changes
      const expandedGroups = [
        ...initialGroups,
        createGroup('beta-framer'),
        createGroup('beta-css'),
      ]

      rerender({
        allGroups: expandedGroups,
        groupId: 'alpha-framer',
        currentGroupId: 'alpha-framer',
        setCurrentGroupId,
        navigateToGroup,
      })

      // Still no navigation — current group is still valid
      expect(setCurrentGroupId).not.toHaveBeenCalled()
      expect(navigateToGroup).not.toHaveBeenCalled()
    })

    it('falls back to first group when current group is removed from allGroups', () => {
      const setCurrentGroupId = vi.fn()
      const navigateToGroup = vi.fn()

      const { rerender } = renderHook((props) => useGroupInitialization(props), {
        initialProps: {
          allGroups: [createGroup('alpha-framer'), createGroup('beta-framer')],
          groupId: 'beta-framer',
          currentGroupId: 'beta-framer',
          setCurrentGroupId,
          navigateToGroup,
        },
      })

      expect(setCurrentGroupId).not.toHaveBeenCalled()

      // Remove beta-framer from allGroups
      rerender({
        allGroups: [createGroup('alpha-framer')],
        groupId: 'beta-framer',
        currentGroupId: 'beta-framer',
        setCurrentGroupId,
        navigateToGroup,
      })

      // beta-framer is no longer valid → should fall back to first group
      // groupId 'beta-framer' ends with -framer, so it goes to the "valid groupId" check
      // but hasGroup returns false → falls through to the default fallback
      expect(setCurrentGroupId).toHaveBeenCalledWith('alpha-framer')
      expect(navigateToGroup).toHaveBeenCalledWith('alpha-framer', { replace: true })
    })
  })
})
