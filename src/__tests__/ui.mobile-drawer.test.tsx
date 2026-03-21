import { MobileDrawer } from '@/components/ui/MobileDrawer'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import type { Category } from '@/types/animation'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockCategories: Category[] = [
  {
    id: 'base',
    title: 'Base',
    groups: [
      { id: 'group-1-framer', title: 'Group 1 (Framer)', tech: 'framer', animations: [] },
      { id: 'group-1-css', title: 'Group 1 (CSS)', tech: 'css', animations: [] },
    ],
  },
]

function renderDrawer(overrides?: { isOpen?: boolean }) {
  const onClose = vi.fn()
  const onGroupSelect = vi.fn()
  const onModeSelect = vi.fn()

  const result = render(
    <CodeModeProvider>
      <MobileDrawer
        isOpen={overrides?.isOpen ?? true}
        codeMode="Framer"
        categories={mockCategories}
        currentGroupId="group-1-framer"
        onClose={onClose}
        onGroupSelect={onGroupSelect}
        onModeSelect={onModeSelect}
      />
    </CodeModeProvider>
  )

  return { ...result, onClose, onGroupSelect, onModeSelect }
}

describe('MobileDrawer', () => {
  it('renders as dialog with aria-modal when open', () => {
    renderDrawer()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).not.toHaveAttribute('hidden')
  })

  it('is hidden when closed', () => {
    renderDrawer({ isOpen: false })
    const dialog = screen.getByRole('dialog', { hidden: true })
    expect(dialog).toHaveAttribute('hidden')
  })

  it('calls onClose when close button is clicked', () => {
    const { onClose } = renderDrawer()
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when overlay is clicked', () => {
    const { onClose } = renderDrawer()
    fireEvent.click(screen.getByTestId('drawer-overlay'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls both onGroupSelect and onClose when a group is selected', () => {
    const { onGroupSelect, onClose } = renderDrawer()
    fireEvent.click(screen.getByText('Group 1'))
    expect(onGroupSelect).toHaveBeenCalledWith('group-1-framer')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders the code mode switch inside the drawer', () => {
    renderDrawer()
    // The drawer should contain the code mode switch buttons
    expect(screen.getByRole('button', { name: 'Framer' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'CSS' })).toBeVisible()
  })

  it('calls onModeSelect when CSS mode is selected', () => {
    const { onModeSelect } = renderDrawer()
    fireEvent.click(screen.getByRole('button', { name: 'CSS' }))
    expect(onModeSelect).toHaveBeenCalledWith('CSS')
  })

  it('highlights current group in the navigation', () => {
    renderDrawer()
    // Group 1 is the current group — it should have active styling
    const groupButton = screen.getByText('Group 1')
    expect(groupButton.className).toContain('active')
  })

  it('renders all categories from the provided list', () => {
    const categories: import('@/types/animation').Category[] = [
      {
        id: 'cat-a',
        title: 'Category A',
        groups: [
          { id: 'ga-framer', title: 'GA (Framer)', tech: 'framer' as const, animations: [] },
          { id: 'ga-css', title: 'GA (CSS)', tech: 'css' as const, animations: [] },
        ],
      },
      {
        id: 'cat-b',
        title: 'Category B',
        groups: [
          { id: 'gb-framer', title: 'GB (Framer)', tech: 'framer' as const, animations: [] },
          { id: 'gb-css', title: 'GB (CSS)', tech: 'css' as const, animations: [] },
        ],
      },
    ]

    render(
      <CodeModeProvider>
        <MobileDrawer
          isOpen={true}
          codeMode="Framer"
          categories={categories}
          currentGroupId="ga-framer"
          onClose={vi.fn()}
          onGroupSelect={vi.fn()}
          onModeSelect={vi.fn()}
        />
      </CodeModeProvider>
    )

    expect(screen.getByText('Category A')).toBeVisible()
    expect(screen.getByText('Category B')).toBeVisible()
  })
})
