import type { Category } from '@/types/animation'
import { fireEvent, render, screen } from '@testing-library/react'
import { AppSidebar } from './AppSidebar'

describe('AppSidebar', () => {
  const mockCategories: Category[] = [
    {
      id: 'category-1',
      title: 'Category 1',
      groups: [
        { id: 'group-1', title: 'Group 1', animations: [] },
        { id: 'group-2', title: 'Group 2', animations: [] },
      ],
    },
    {
      id: 'category-2',
      title: 'Category 2',
      groups: [{ id: 'group-3', title: 'Group 3', animations: [] }],
    },
  ]

  const mockOnCategorySelect = jest.fn()
  const mockOnGroupSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all categories', () => {
    render(
      <AppSidebar
        categories={mockCategories}
        currentGroupId="group-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    )

    expect(screen.getByText('Category 1')).toBeInTheDocument()
    expect(screen.getByText('Category 2')).toBeInTheDocument()
  })

  it('shows all groups and highlights active category', () => {
    render(
      <AppSidebar
        categories={mockCategories}
        currentGroupId="group-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    )

    // All groups should be visible
    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(screen.getByText('Group 2')).toBeInTheDocument()

    // Inactive category's groups are also rendered
    expect(screen.getByText('Group 3')).toBeInTheDocument()

    // Active category should have active styling because it contains the current group
    const activeCategory = screen.getByText('Category 1')
    expect(activeCategory.className).toContain('pf-sidebar__link--active')
    const inactiveCategory = screen.getByText('Category 2')
    expect(inactiveCategory.className).not.toContain('pf-sidebar__link--active')
  })

  it('applies active styling to current category', () => {
    render(
      <AppSidebar
        categories={mockCategories}
        currentGroupId="group-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    )

    const activeCategory = screen.getByText('Category 1')
    expect(activeCategory.className).toContain('pf-sidebar__link--active')

    const inactiveCategory = screen.getByText('Category 2')
    expect(inactiveCategory.className).not.toContain('pf-sidebar__link--active')
  })

  it('calls onCategorySelect when a category is clicked', () => {
    render(
      <AppSidebar
        categories={mockCategories}
        currentGroupId="group-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    )

    fireEvent.click(screen.getByText('Category 2'))
    expect(mockOnCategorySelect).toHaveBeenCalledWith('category-2')
  })

  it('calls onGroupSelect when a group is clicked', () => {
    render(
      <AppSidebar
        categories={mockCategories}
        currentGroupId="group-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    )

    fireEvent.click(screen.getByText('Group 1'))
    expect(mockOnGroupSelect).toHaveBeenCalledWith('group-1')
  })

  it('renders correctly when category has no groups', () => {
    const categoriesWithoutGroups: Category[] = [
      { id: 'empty-category', title: 'Empty Category', groups: [] },
    ]

    render(
      <AppSidebar
        categories={categoriesWithoutGroups}
        currentGroupId=""
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    )

    expect(screen.getByText('Empty Category')).toBeInTheDocument()
    // Should not render subnav when there are no groups
    expect(screen.queryByRole('button', { name: /Group/i })).not.toBeInTheDocument()
  })

  it('updates active states when current group changes', () => {
    const { rerender } = render(
      <AppSidebar
        categories={mockCategories}
        currentGroupId="group-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    )

    // Initially, group-1 is active, so Category 1 should be active
    const category1 = screen.getByText('Category 1')
    const category2 = screen.getByText('Category 2')
    expect(category1.className).toContain('pf-sidebar__link--active')
    expect(category2.className).not.toContain('pf-sidebar__link--active')
    const group1 = screen.getByText('Group 1')
    expect(group1.className).toContain('pf-sidebar__link--active')

    // Change to group-3 (in Category 2)
    rerender(
      <AppSidebar
        categories={mockCategories}
        currentGroupId="group-3"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    )

    // Now Category 2 should be active and Group 3 active
    expect(screen.getByText('Category 2').className).toContain('pf-sidebar__link--active')
    expect(screen.getByText('Category 1').className).not.toContain('pf-sidebar__link--active')
    expect(screen.getByText('Group 3').className).toContain('pf-sidebar__link--active')
  })
})
