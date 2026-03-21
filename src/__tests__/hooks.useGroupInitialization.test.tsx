import { useGroupInitialization } from '@/hooks/useGroupInitialization'
import type { Group } from '@/types/animation'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const createGroup = (id: string): Group => ({
  id,
  title: id,
  animations: [],
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

    const { rerender } = renderHook(
      (props) => useGroupInitialization(props),
      {
        initialProps: {
          allGroups: groups,
          groupId: 'alpha-framer',
          currentGroupId: 'alpha-framer',
          setCurrentGroupId,
          navigateToGroup,
        },
      }
    )

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

    const { rerender } = renderHook(
      (props) => useGroupInitialization(props),
      {
        initialProps: {
          allGroups: groups,
          groupId: 'alpha-framer',
          currentGroupId: '',
          setCurrentGroupId,
          navigateToGroup,
        },
      }
    )

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
})
