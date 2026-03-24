import { CodeModeProvider } from '@/contexts/CodeModeContext'
import type { Category } from '@/types/animation'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppSidebar } from '@/components/ui/AppSidebar'

const mockCategories: Category[] = [
  {
    id: 'category-1',
    title: 'Category 1',
    groups: [
      { id: 'group-1-framer', title: 'Group 1 (Framer)', tech: 'framer', animations: [] },
      { id: 'group-1-css', title: 'Group 1 (CSS)', tech: 'css', animations: [] },
      { id: 'group-2-framer', title: 'Group 2 (Framer)', tech: 'framer', animations: [] },
    ],
  },
  {
    id: 'category-2',
    title: 'Category 2',
    groups: [
      { id: 'group-3-framer', title: 'Group 3 (Framer)', tech: 'framer', animations: [] },
      { id: 'group-3-css', title: 'Group 3 (CSS)', tech: 'css', animations: [] },
    ],
  },
]

const mockOnGroupSelect = vi.fn()

const renderSidebar = (
  categories: Category[],
  currentGroupId: string,
  codeMode: 'Framer' | 'CSS' = 'Framer'
) =>
  render(
    <CodeModeProvider>
      <AppSidebar
        categories={categories}
        codeMode={codeMode}
        currentGroupId={currentGroupId}
        onGroupSelect={mockOnGroupSelect}
      />
    </CodeModeProvider>
  )

describe('AppSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all categories', () => {
    renderSidebar(mockCategories, 'group-1-framer')
    expect(screen.getByTestId('sidebar-section-category-1')).toBeVisible()
    expect(screen.getByTestId('sidebar-section-category-2')).toBeVisible()
  })

  it('renders groups for all categories by default', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    expect(screen.getByTestId('sidebar-group-group-1')).toBeVisible()
    expect(screen.getByTestId('sidebar-group-group-2')).toBeVisible()
    expect(screen.getByTestId('sidebar-group-group-3')).toBeVisible()
  })

  it('deduplicates framer/css variants into one group entry', () => {
    renderSidebar(mockCategories, 'group-1-framer')
    // group-1 has both framer and css variants but should render as one sidebar entry
    const cat1Nav = screen.getByTestId('sidebar-subnav-category-1')
    const groupButtons = within(cat1Nav).getAllByTestId(/^sidebar-group-group-1$/)
    expect(groupButtons).toHaveLength(1)
  })

  it('applies active styling to current group', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    const activeGroup = screen.getByTestId('sidebar-group-group-1')
    const inactiveGroup = screen.getByTestId('sidebar-group-group-2')

    expect(activeGroup).toHaveClass('pf-sidebar__nav-link--active')
    expect(inactiveGroup).not.toHaveClass('pf-sidebar__nav-link--active')
  })

  it('toggles category expansion on click', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    // Click Category 2 toggle header to collapse it
    const cat2Section = screen.getByTestId('sidebar-section-category-2')
    const cat2Toggle = within(cat2Section).getByTestId('control-group-toggle')
    fireEvent.click(cat2Toggle)

    expect(screen.queryByTestId('sidebar-group-group-3')).not.toBeInTheDocument()
    expect(screen.getByTestId('sidebar-group-group-1')).toBeVisible()
  })

  it('supports independent category collapse/expand', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    // Collapse Category 1
    const cat1Section = screen.getByTestId('sidebar-section-category-1')
    const cat1Toggle = within(cat1Section).getByTestId('control-group-toggle')
    fireEvent.click(cat1Toggle)
    expect(screen.queryByTestId('sidebar-group-group-1')).not.toBeInTheDocument()
    expect(screen.getByTestId('sidebar-group-group-3')).toHaveClass('pf-sidebar__nav-link')

    // Collapse Category 2
    const cat2Section = screen.getByTestId('sidebar-section-category-2')
    const cat2Toggle = within(cat2Section).getByTestId('control-group-toggle')
    fireEvent.click(cat2Toggle)
    expect(screen.queryByTestId('sidebar-group-group-3')).not.toBeInTheDocument()

    // Re-expand Category 1
    fireEvent.click(cat1Toggle)
    expect(screen.getByTestId('sidebar-group-group-1')).toHaveClass('pf-sidebar__nav-link')
  })

  it('calls onGroupSelect with framer variant in Framer mode', () => {
    renderSidebar(mockCategories, 'group-1-framer', 'Framer')
    fireEvent.click(screen.getByTestId('sidebar-group-group-1'))
    expect(mockOnGroupSelect).toHaveBeenCalledWith('group-1-framer')
  })

  it('calls onGroupSelect with css variant in CSS mode', () => {
    renderSidebar(mockCategories, 'group-1-css', 'CSS')
    fireEvent.click(screen.getByTestId('sidebar-group-group-1'))
    expect(mockOnGroupSelect).toHaveBeenCalledWith('group-1-css')
  })

  it('falls back to available variant when selected mode is missing', () => {
    renderSidebar(mockCategories, 'group-2-framer', 'CSS')
    fireEvent.click(screen.getByTestId('sidebar-group-group-2'))
    expect(mockOnGroupSelect).toHaveBeenCalledWith('group-2-framer')
  })

  it('renders correctly when category has no groups', () => {
    const categoriesWithoutGroups: Category[] = [
      { id: 'empty-category', title: 'Empty Category', groups: [] },
    ]
    renderSidebar(categoriesWithoutGroups, '', 'Framer')
    expect(screen.getByTestId('sidebar-section-empty-category')).toBeVisible()
    expect(screen.queryByTestId(/sidebar-group-/)).not.toBeInTheDocument()
  })

  it('updates visible groups and active states when current group changes', () => {
    const { rerender } = renderSidebar(mockCategories, 'group-1-framer')

    expect(screen.getByTestId('sidebar-group-group-1')).toHaveClass('pf-sidebar__nav-link--active')
    expect(screen.getByTestId('sidebar-group-group-3')).not.toHaveClass(
      'pf-sidebar__nav-link--active'
    )

    rerender(
      <CodeModeProvider>
        <AppSidebar
          categories={mockCategories}
          codeMode="Framer"
          currentGroupId="group-3-framer"
          onGroupSelect={mockOnGroupSelect}
        />
      </CodeModeProvider>
    )

    expect(screen.getByTestId('sidebar-group-group-3')).toHaveClass('pf-sidebar__nav-link--active')
    expect(screen.getByTestId('sidebar-group-group-1')).not.toHaveClass(
      'pf-sidebar__nav-link--active'
    )
  })
})
