import { CodeModeProvider } from '@/contexts/CodeModeContext'
import type { Category } from '@/types/animation'
import { fireEvent, render, screen } from '@testing-library/react'
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

const mockOnCategorySelect = jest.fn()
const mockOnGroupSelect = jest.fn()

const renderSidebar = (categories: Category[], currentGroupId: string, codeMode: 'Framer' | 'CSS' = 'Framer') =>
  render(
    <CodeModeProvider>
      <AppSidebar
        categories={categories}
        codeMode={codeMode}
        currentGroupId={currentGroupId}
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    </CodeModeProvider>
  )

describe('AppSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all categories', () => {
    renderSidebar(mockCategories, 'group-1-framer')
    expect(screen.getByText('Category 1')).toBeInTheDocument()
    expect(screen.getByText('Category 2')).toBeInTheDocument()
  })

  it('renders groups for all categories by default', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(screen.getByText('Group 2')).toBeInTheDocument()
    expect(screen.getByText('Group 3')).toBeInTheDocument()
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

  it('toggles category expansion without invoking onCategorySelect', () => {
    renderSidebar(mockCategories, 'group-1-framer')
    fireEvent.click(screen.getByText('Category 2'))
    expect(screen.queryByText('Group 3')).not.toBeInTheDocument()
    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(mockOnCategorySelect).not.toHaveBeenCalled()
  })

  it('supports independent category collapse/expand', () => {
    renderSidebar(mockCategories, 'group-1-framer')

    fireEvent.click(screen.getByText('Category 1'))
    expect(screen.queryByText('Group 1')).not.toBeInTheDocument()
    expect(screen.getByText('Group 3')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Category 2'))
    expect(screen.queryByText('Group 3')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Category 1'))
    expect(screen.getByText('Group 1')).toBeInTheDocument()
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
    const categoriesWithoutGroups: Category[] = [{ id: 'empty-category', title: 'Empty Category', groups: [] }]
    renderSidebar(categoriesWithoutGroups, '', 'Framer')
    expect(screen.getByText('Empty Category')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Group/i })).not.toBeInTheDocument()
  })

  it('updates visible groups and active states when current group changes', () => {
    const { rerender } = renderSidebar(mockCategories, 'group-1-framer')

    expect(screen.getByText('Category 1').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Category 2').className).not.toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 1').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 3')).toBeInTheDocument()

    rerender(
      <CodeModeProvider>
        <AppSidebar
          categories={mockCategories}
          codeMode="Framer"
          currentGroupId="group-3-framer"
          onCategorySelect={mockOnCategorySelect}
          onGroupSelect={mockOnGroupSelect}
        />
      </CodeModeProvider>
    )

    expect(screen.getByText('Category 2').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Category 1').className).not.toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 3').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 1')).toBeInTheDocument()
  })
})
