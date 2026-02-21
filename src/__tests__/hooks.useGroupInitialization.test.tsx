import { useGroupInitialization } from '@/hooks/useGroupInitialization'
import type { Group } from '@/types/animation'
import { renderHook } from '@testing-library/react'

const createGroup = (id: string): Group => ({
  id,
  title: id,
  animations: [],
})

describe('hooks • useGroupInitialization', () => {
  it('syncs current group when route groupId is valid', () => {
    const setCurrentGroupId = jest.fn()
    const navigateToGroup = jest.fn()
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
    const setCurrentGroupId = jest.fn()
    const navigateToGroup = jest.fn()
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
    const setCurrentGroupId = jest.fn()
    const navigateToGroup = jest.fn()
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
    const setCurrentGroupId = jest.fn()
    const navigateToGroup = jest.fn()
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
})
