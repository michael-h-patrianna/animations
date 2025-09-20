import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import type { Category } from '@/types/animation';

describe('Sidebar', () => {
  const mockCategories: Category[] = [
    {
      id: 'category-1',
      title: 'Category 1',
      groups: [
        {
          id: 'group-1',
          title: 'Group 1',
          animations: []
        },
        {
          id: 'group-2', 
          title: 'Group 2',
          animations: []
        }
      ]
    },
    {
      id: 'category-2',
      title: 'Category 2',
      groups: [
        {
          id: 'group-3',
          title: 'Group 3',
          animations: []
        }
      ]
    }
  ];

  const mockOnCategorySelect = jest.fn();
  const mockOnGroupSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all categories', () => {
    render(
      <Sidebar
        categories={mockCategories}
        currentCategoryId="category-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    );

    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('shows groups only for the active category', () => {
    render(
      <Sidebar
        categories={mockCategories}
        currentCategoryId="category-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    );

    // Groups from active category should be visible
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2')).toBeInTheDocument();
    
    // Groups from inactive category should not be visible
    expect(screen.queryByText('Group 3')).not.toBeInTheDocument();
  });

  it('applies active styling to current category', () => {
    render(
      <Sidebar
        categories={mockCategories}
        currentCategoryId="category-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    );

    const activeCategory = screen.getByText('Category 1');
    expect(activeCategory.className).toContain('pf-sidebar__link--active');
    
    const inactiveCategory = screen.getByText('Category 2');
    expect(inactiveCategory.className).not.toContain('pf-sidebar__link--active');
  });

  it('calls onCategorySelect when a category is clicked', () => {
    render(
      <Sidebar
        categories={mockCategories}
        currentCategoryId="category-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    );

    fireEvent.click(screen.getByText('Category 2'));
    expect(mockOnCategorySelect).toHaveBeenCalledWith('category-2');
  });

  it('calls onGroupSelect when a group is clicked', () => {
    render(
      <Sidebar
        categories={mockCategories}
        currentCategoryId="category-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    );

    fireEvent.click(screen.getByText('Group 1'));
    expect(mockOnGroupSelect).toHaveBeenCalledWith('category-1', 'group-1');
  });

  it('renders correctly when category has no groups', () => {
    const categoriesWithoutGroups: Category[] = [
      {
        id: 'empty-category',
        title: 'Empty Category',
        groups: []
      }
    ];

    render(
      <Sidebar
        categories={categoriesWithoutGroups}
        currentCategoryId="empty-category"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    );

    expect(screen.getByText('Empty Category')).toBeInTheDocument();
    // Should not render subnav when there are no groups
    expect(screen.queryByRole('button', { name: /Group/i })).not.toBeInTheDocument();
  });

  it('updates groups when current category changes', () => {
    const { rerender } = render(
      <Sidebar
        categories={mockCategories}
        currentCategoryId="category-1"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    );

    // Initially shows groups from category-1
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.queryByText('Group 3')).not.toBeInTheDocument();

    // Change to category-2
    rerender(
      <Sidebar
        categories={mockCategories}
        currentCategoryId="category-2"
        onCategorySelect={mockOnCategorySelect}
        onGroupSelect={mockOnGroupSelect}
      />
    );

    // Now shows groups from category-2
    expect(screen.queryByText('Group 1')).not.toBeInTheDocument();
    expect(screen.getByText('Group 3')).toBeInTheDocument();
  });
});