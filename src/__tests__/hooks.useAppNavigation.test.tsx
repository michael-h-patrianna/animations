import { useAppNavigation } from '@/hooks/useAppNavigation'
import type { Category } from '@/types/animation'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

const mockCategories: Category[] = [
  {
    id: 'base',
    title: 'Base',
    groups: [
      {
        id: 'standard-effects-framer',
        title: 'Standard effects (Framer)',
        tech: 'framer',
        animations: [
          {
            id: 'standard-effects__bounce',
            title: 'Bounce',
            description: 'Bounce',
            categoryId: 'base',
            groupId: 'standard-effects-framer',
          },
        ],
      },
      {
        id: 'standard-effects-css',
        title: 'Standard effects (CSS)',
        tech: 'css',
        animations: [
          {
            id: 'standard-effects__bounce',
            title: 'Bounce',
            description: 'Bounce',
            categoryId: 'base',
            groupId: 'standard-effects-css',
          },
        ],
      },
    ],
  },
  {
    id: 'dialogs',
    title: 'Dialogs',
    groups: [
      {
        id: 'modal-base-framer',
        title: 'Modal base (Framer)',
        tech: 'framer',
        animations: [],
      },
      {
        id: 'modal-base-css',
        title: 'Modal base (CSS)',
        tech: 'css',
        animations: [],
      },
    ],
  },
]

function createWrapper(initialRoute: string) {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/:groupId?" element={children} />
      </Routes>
    </MemoryRouter>
  )
}

describe('useAppNavigation', () => {
  it('flattens all groups from categories', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer'),
    })

    expect(result.current.allGroups).toHaveLength(4)
    expect(result.current.allGroups.map((g) => g.id)).toEqual([
      'standard-effects-framer',
      'standard-effects-css',
      'modal-base-framer',
      'modal-base-css',
    ])
  })

  it('sets currentGroup from URL groupId param', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer'),
    })

    expect(result.current.currentGroupId).toBe('standard-effects-framer')
    expect(result.current.currentGroup?.id).toBe('standard-effects-framer')
  })

  it('handleGroupSelect does not re-navigate when selecting current group', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer'),
    })

    // Calling handleGroupSelect with the current group should be a no-op
    // (won't throw, won't change state)
    result.current.handleGroupSelect('standard-effects-framer')
    expect(result.current.currentGroupId).toBe('standard-effects-framer')
  })

  it('handleModeSelect does nothing when currentGroupId is empty', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/'),
    })

    // Should not throw when called with no current group
    expect(() => result.current.handleModeSelect('CSS')).not.toThrow()
  })

  it('returns stable allGroups reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer'),
    })

    const first = result.current.allGroups
    rerender()
    expect(result.current.allGroups).toBe(first)
  })

  it('returns undefined currentGroup for empty categories', () => {
    const { result } = renderHook(() => useAppNavigation([]), {
      wrapper: createWrapper('/'),
    })

    expect(result.current).toEqual(
      expect.objectContaining({ currentGroup: undefined, allGroups: [] })
    )
  })
})
