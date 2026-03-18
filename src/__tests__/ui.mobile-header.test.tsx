import { MobileHeader } from '@/components/ui/MobileHeader'
import type { Group } from '@/types/animation'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

/** Ref-shaped object for testing — avoids deprecated createRef in non-component code. */
const makeRef = () => ({ current: null as HTMLDivElement | null })

const mockGroup: Group = {
  id: 'standard-effects-framer',
  title: 'Standard Effects (Framer)',
  tech: 'framer',
  animations: [
    { id: 'a1', title: 't', description: 'd', categoryId: 'base', groupId: 'g' },
    { id: 'a2', title: 't', description: 'd', categoryId: 'base', groupId: 'g' },
    { id: 'a3', title: 't', description: 'd', categoryId: 'base', groupId: 'g' },
  ],
}

describe('MobileHeader', () => {
  it('renders hamburger button with correct aria attributes', () => {
    const ref = makeRef()
    render(<MobileHeader currentGroup={mockGroup} appBarRef={ref} onOpenDrawer={vi.fn()} />)

    const btn = screen.getByRole('button', { name: 'Open menu' })
    expect(btn).toHaveAttribute('aria-haspopup', 'dialog')
    expect(btn).toHaveAttribute('aria-controls', 'pf-sidebar-drawer')
  })

  it('calls onOpenDrawer when hamburger is clicked', () => {
    const ref = makeRef()
    const onOpenDrawer = vi.fn()
    render(<MobileHeader currentGroup={mockGroup} appBarRef={ref} onOpenDrawer={onOpenDrawer} />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(onOpenDrawer).toHaveBeenCalledOnce()
  })

  it('shows current group title with animation count', () => {
    const ref = makeRef()
    render(<MobileHeader currentGroup={mockGroup} appBarRef={ref} onOpenDrawer={vi.fn()} />)

    expect(screen.getByText('Standard Effects (Framer) (3)')).toHaveClass('pf-mobile-header__title')
  })

  it('does not show title when currentGroup is undefined', () => {
    const ref = makeRef()
    render(<MobileHeader currentGroup={undefined} appBarRef={ref} onOpenDrawer={vi.fn()} />)

    expect(screen.queryByText(/\(\d+ animations?\)/)).not.toBeInTheDocument()
  })

  it('renders GitHub link with correct target and rel', () => {
    const ref = makeRef()
    render(<MobileHeader currentGroup={mockGroup} appBarRef={ref} onOpenDrawer={vi.fn()} />)

    const link = screen.getByRole('link', { name: 'View source on GitHub' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('sets data-app-shell="bar" for scroll offset calculation', () => {
    const ref = makeRef()
    const { container } = render(
      <MobileHeader currentGroup={mockGroup} appBarRef={ref} onOpenDrawer={vi.fn()} />
    )

    expect(container.querySelector('[data-app-shell="bar"]')?.className).toContain(
      'pf-mobile-header'
    )
  })
})
