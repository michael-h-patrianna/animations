import { CodeModeProvider } from '@/contexts/CodeModeContext'
import type { Category } from '@/types/animation'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppSidebar } from './AppSidebar'

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
    expect(screen.getByText('Category 1')).toHaveClass('pf-sidebar__link--category')
    expect(screen.getByText('Category 2')).toHaveClass('pf-sidebar__link--category')
  })

  it('renders groups for all categories by default', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    expect(screen.getByText('Group 1')).toHaveClass('pf-sidebar__link--group')
    expect(screen.getByText('Group 2')).toHaveClass('pf-sidebar__link--group')
    expect(screen.getByText('Group 3')).toHaveClass('pf-sidebar__link--group')
  })

  it('deduplicates framer/css variants into one group entry', () => {
    renderSidebar(mockCategories, 'group-1-framer')
    expect(screen.getAllByText('Group 1')).toHaveLength(1)
  })

  it('applies active styling to current category', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    const activeCategory = screen.getByText('Category 1')
    const inactiveCategory = screen.getByText('Category 2')

    expect(activeCategory.className).toContain('pf-sidebar__link--active')
    expect(inactiveCategory.className).not.toContain('pf-sidebar__link--active')
  })

  it('toggles category expansion on click', () => {
    renderSidebar(mockCategories, 'group-1-framer')
    fireEvent.click(screen.getByText('Category 2'))
    expect(screen.queryByText('Group 3')).not.toBeInTheDocument()
    expect(screen.getByText('Group 1')).toHaveClass('pf-sidebar__link--group')
  })

  it('supports independent category collapse/expand', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    fireEvent.click(screen.getByText('Category 1'))
    expect(screen.queryByText('Group 1')).not.toBeInTheDocument()
    expect(screen.getByText('Group 3')).toHaveClass('pf-sidebar__link--group')

    fireEvent.click(screen.getByText('Category 2'))
    expect(screen.queryByText('Group 3')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Category 1'))
    expect(screen.getByText('Group 1')).toHaveClass('pf-sidebar__link--group')
  })

  it('calls onGroupSelect with framer variant in Framer mode', () => {
    renderSidebar(mockCategories, 'group-1-framer', 'Framer')
    fireEvent.click(screen.getByText('Group 1'))
    expect(mockOnGroupSelect).toHaveBeenCalledWith('group-1-framer')
  })

  it('calls onGroupSelect with css variant in CSS mode', () => {
    renderSidebar(mockCategories, 'group-1-css', 'CSS')
    fireEvent.click(screen.getByText('Group 1'))
    expect(mockOnGroupSelect).toHaveBeenCalledWith('group-1-css')
  })

  it('falls back to available variant when selected mode is missing', () => {
    renderSidebar(mockCategories, 'group-2-framer', 'CSS')
    fireEvent.click(screen.getByText('Group 2'))
    expect(mockOnGroupSelect).toHaveBeenCalledWith('group-2-framer')
  })

  it('renders correctly when category has no groups', () => {
    const categoriesWithoutGroups: Category[] = [
      { id: 'empty-category', title: 'Empty Category', groups: [] },
    ]
    renderSidebar(categoriesWithoutGroups, '', 'Framer')
    expect(screen.getByText('Empty Category')).toHaveClass('pf-sidebar__link--category')
    expect(screen.queryByRole('button', { name: /Group/i })).not.toBeInTheDocument()
  })

  it('updates visible groups and active states when current group changes', () => {
    const { rerender } = renderSidebar(mockCategories, 'group-1-framer')

    expect(screen.getByText('Category 1').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Category 2').className).not.toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 1').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 3')).toHaveClass('pf-sidebar__link--group')

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

    expect(screen.getByText('Category 2').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Category 1').className).not.toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 3').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 1')).toHaveClass('pf-sidebar__link--group')
  })
})
