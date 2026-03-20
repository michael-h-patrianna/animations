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
})
