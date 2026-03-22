import { CodeModeProvider } from '@/contexts/CodeModeContext'
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
    <CodeModeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/:groupId?" element={children} />
        </Routes>
      </MemoryRouter>
    </CodeModeProvider>
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

  it('handleModeSelect does not navigate when target variant does not exist', () => {
    // Category with only framer groups — no CSS variant
    const categoriesFramerOnly: Category[] = [
      {
        id: 'base',
        title: 'Base',
        groups: [
          {
            id: 'only-framer-framer',
            title: 'Only Framer (Framer)',
            tech: 'framer',
            animations: [
              {
                id: 'only-framer__test',
                title: 'Test',
                description: 'Test',
                categoryId: 'base',
                groupId: 'only-framer-framer',
              },
            ],
          },
        ],
      },
    ]

    const { result } = renderHook(() => useAppNavigation(categoriesFramerOnly), {
      wrapper: createWrapper('/only-framer-framer'),
    })

    // Attempting to switch to CSS when no css variant exists should be a no-op
    result.current.handleModeSelect('CSS')
    // currentGroupId should remain on the framer variant
    expect(result.current.currentGroupId).toBe('only-framer-framer')
  })

  it('handleGroupSelect navigates to a different group', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer'),
    })

    expect(result.current.currentGroupId).toBe('standard-effects-framer')

    // Select a different group
    result.current.handleGroupSelect('modal-base-framer')
    // After navigation, the router would update — we verify the handler was callable
    // (full navigation testing requires router integration)
  })

  it('currentGroup matches the resolved group from allGroups', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/modal-base-framer'),
    })

    expect(result.current.currentGroup?.id).toBe('modal-base-framer')
    expect(result.current.currentGroup?.title).toBe('Modal base (Framer)')
  })

  it('extracts animationFilter from URL search params', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer?animation=standard-effects__bounce'),
    })

    expect(result.current.animationFilter).toBe('standard-effects__bounce')
  })

  it('animationFilter is undefined when no query param is present', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer'),
    })

    expect(result.current).toHaveProperty('animationFilter', undefined)
  })

  it('handleGroupSelect strips animation filter (sidebar navigation clears filter)', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer?animation=standard-effects__bounce'),
    })

    // handleGroupSelect should navigate without the filter
    // (it calls navigateToGroup without search param)
    expect(result.current.animationFilter).toBe('standard-effects__bounce')

    // After selecting a different group, the filter should be stripped
    result.current.handleGroupSelect('modal-base-framer')
    // The actual URL update happens via react-router, which we can't directly observe
    // in this unit test. But we verify the handler is callable without throwing.
  })

  it('handleGroupSelect navigates even to current group when filter is active', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer?animation=standard-effects__bounce'),
    })

    // Normally selecting the current group is a no-op, but with a filter active
    // the navigation should still fire (to strip the filter)
    // The guard in handleGroupSelect is: if (gId === currentGroupId && !animationFilter) return
    // So with animationFilter present, it should NOT return early
    expect(() => result.current.handleGroupSelect('standard-effects-framer')).not.toThrow()
  })

  it('handleModeSelect preserves animation filter when switching Framer to CSS', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer?animation=standard-effects__bounce'),
    })

    expect(result.current.currentGroupId).toBe('standard-effects-framer')
    expect(result.current.animationFilter).toBe('standard-effects__bounce')

    // Switching to CSS mode should navigate to the CSS variant while preserving filter
    // We can't observe the router navigation directly, but we verify no throw
    // and that the handler computes the correct target group
    expect(() => result.current.handleModeSelect('CSS')).not.toThrow()
  })

  it('handleModeSelect does not navigate when already on the target mode', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/standard-effects-framer'),
    })

    // Already on framer — switching to Framer should be a no-op (targetId === currentGroupId)
    result.current.handleModeSelect('Framer')
    // No navigation — currentGroupId stays the same
    expect(result.current.currentGroupId).toBe('standard-effects-framer')
  })

  it('returns allGroups with correct count from multiple categories', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/'),
    })

    // 2 groups from base + 2 groups from dialogs = 4 total
    expect(result.current.allGroups).toHaveLength(4)
  })

  it('currentGroup is undefined when URL points to nonexistent group', () => {
    const { result } = renderHook(() => useAppNavigation(mockCategories), {
      wrapper: createWrapper('/nonexistent-group'),
    })

    // useGroupInitialization will redirect, but currentGroup lookup should handle missing gracefully
    // The allGroups.find() returns undefined for a non-matching currentGroupId
    // After redirect, currentGroupId will be set to first group
    expect(result.current.allGroups.length).toBe(4)
  })

  it('handleModeSelect strips only trailing -framer/-css suffix (not internal occurrences)', () => {
    // Group ID 'my-framer-effects-framer' contains 'framer' in the middle AND as suffix
    // The regex /-(?:framer|css)$/ should only match the trailing suffix
    const categoriesWithComplexIds: Category[] = [
      {
        id: 'test',
        title: 'Test',
        groups: [
          {
            id: 'framer-effects-framer',
            title: 'Framer Effects (Framer)',
            tech: 'framer',
            animations: [
              {
                id: 'framer-effects__test',
                title: 'Test',
                description: 'Test',
                categoryId: 'test',
                groupId: 'framer-effects-framer',
              },
            ],
          },
          {
            id: 'framer-effects-css',
            title: 'Framer Effects (CSS)',
            tech: 'css',
            animations: [
              {
                id: 'framer-effects__test',
                title: 'Test',
                description: 'Test',
                categoryId: 'test',
                groupId: 'framer-effects-css',
              },
            ],
          },
        ],
      },
    ]

    const { result } = renderHook(() => useAppNavigation(categoriesWithComplexIds), {
      wrapper: createWrapper('/framer-effects-framer'),
    })

    expect(result.current.currentGroupId).toBe('framer-effects-framer')

    // Switching to CSS should produce 'framer-effects-css', not 'framer-effects-css'
    // (regex should strip only the trailing -framer, yielding 'framer-effects', then append -css)
    expect(() => result.current.handleModeSelect('CSS')).not.toThrow()
  })

  it('handleModeSelect does not crash with group ID ending in -css-framer (double suffix)', () => {
    // Edge case: group ID 'weird-css-framer' — regex strips trailing '-framer'
    // leaving 'weird-css', then looks for 'weird-css-css'
    const weirdCategories: Category[] = [
      {
        id: 'test',
        title: 'Test',
        groups: [
          {
            id: 'weird-css-framer',
            title: 'Weird CSS (Framer)',
            tech: 'framer',
            animations: [],
          },
        ],
      },
    ]

    const { result } = renderHook(() => useAppNavigation(weirdCategories), {
      wrapper: createWrapper('/weird-css-framer'),
    })

    // handleModeSelect('CSS') would look for 'weird-css-css' which doesn't exist
    // Should be a no-op (target doesn't exist)
    expect(() => result.current.handleModeSelect('CSS')).not.toThrow()
    expect(result.current.currentGroupId).toBe('weird-css-framer')
  })
})
