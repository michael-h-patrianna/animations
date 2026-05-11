import { AppNavigationContext, useAppNavigation } from '@/contexts/AppNavigationContext'
import type { LazyAppNavigationResult } from '@/hooks/useLazyAppNavigation'
import { asCategoryId, asGroupVariantId } from '@/types/animation'
import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const makeNavigationValue = (): LazyAppNavigationResult => ({
  navCategories: [
    {
      id: 'dialogs',
      title: 'Dialogs',
      groups: [
        {
          id: 'modal-base-framer',
          title: 'Modal Base (Framer)',
          tech: 'framer',
          baseGroupId: 'modal-base',
          categoryId: 'dialogs',
          metadata: { id: 'modal-base', title: 'Modal Base' },
        },
      ],
    },
  ],
  allGroups: [],
  currentGroupId: 'modal-base-framer',
  currentGroup: {
    id: asGroupVariantId('modal-base-framer'),
    title: 'Modal Base (Framer)',
    tech: 'framer',
    animations: [
      {
        id: 'modal-base__scale-gentle-pop' as never,
        title: 'Scale Gentle Pop',
        description: 'Opens with a gentle pop.',
        categoryId: asCategoryId('dialogs'),
        groupId: asGroupVariantId('modal-base-framer'),
        urlSlugFramer: '/modal-base-framer?animation=modal-base__scale-gentle-pop',
        urlSlugCss: '/modal-base-css?animation=modal-base__scale-gentle-pop',
      },
    ],
  },
  isPending: false,
  animationFilter: 'modal-base__scale-gentle-pop',
  handleModeSelect: vi.fn(),
  handleGroupSelect: vi.fn(),
})

describe('AppNavigationContext', () => {
  it('throws when consumed outside AppNavigationContext provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    try {
      expect(() => renderHook(() => useAppNavigation())).toThrow(
        'useAppNavigation must be used within an AppNavigationContext provider'
      )
    } finally {
      spy.mockRestore()
    }
  })

  it('exposes navigation state and handlers to consumers', () => {
    const value = makeNavigationValue()

    function Consumer() {
      const navigation = useAppNavigation()
      return (
        <button onClick={() => navigation.handleGroupSelect('lights-css')}>
          {navigation.currentGroup?.title}:{navigation.animationFilter}:
          {navigation.navCategories[0]?.groups[0]?.title}
        </button>
      )
    }

    render(
      <AppNavigationContext value={value}>
        <Consumer />
      </AppNavigationContext>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(
      'Modal Base (Framer):modal-base__scale-gentle-pop:Modal Base (Framer)'
    )
    fireEvent.click(button)
    expect(value.handleGroupSelect).toHaveBeenCalledWith('lights-css')
  })
})
