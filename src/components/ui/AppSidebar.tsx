import type { Category } from '@/types/animation'
import type { FC } from 'react'

interface AppSidebarProps {
  categories: Category[]
  currentGroupId: string
  onCategorySelect: (categoryId: string) => void
  onGroupSelect: (groupId: string) => void
  className?: string
}

/**
 * Navigation sidebar component displaying hierarchical category and group structure.
 *
 * Renders a collapsible accordion-style navigation with categories as top-level items
 * and their associated groups as nested subitems. Highlights the currently active
 * group and its parent category.
 *
 * @component
 * @param {AppSidebarProps} props - Component props
 * @param {Category[]} props.categories - Array of animation categories with nested groups
 * @param {string} props.currentGroupId - ID of the currently selected group for highlighting
 * @param {(categoryId: string) => void} props.onCategorySelect - Callback when category header clicked
 * @param {(groupId: string) => void} props.onGroupSelect - Callback when group item clicked
 * @param {string} [props.className] - Optional CSS class name for custom styling
 *
 * @returns {JSX.Element} Sidebar navigation component
 *
 * @example
 * ```tsx
 * <AppSidebar
 *   categories={animationCategories}
 *   currentGroupId="button-effects"
 *   onCategorySelect={(id) => console.log('Category:', id)}
 *   onGroupSelect={(id) => navigateToGroup(id)}
 *   className="custom-sidebar"
 * />
 * ```
 *
 * @remarks
 * - Categories show active state when any of their groups is selected
 * - Groups show active state when they match currentGroupId
 * - Categories without groups only display the category header
 * - Uses BEM naming convention for CSS classes (pf-sidebar)
 */
export const AppSidebar: FC<AppSidebarProps> = ({
  categories,
  currentGroupId,
  onCategorySelect,
  onGroupSelect,
  className,
}) => {
  return (
    <aside className={`pf-sidebar${className ? ` ${className}` : ''}`}>
      <div className="pf-sidebar__nav">
        {categories.map((category) => {
          // Check if any group in this category is currently active
          const hasActiveGroup = category.groups.some((group) => group.id === currentGroupId)

          return (
            <div key={category.id} className="pf-sidebar__section">
              <button
                onClick={() => onCategorySelect(category.id)}
                className={`pf-sidebar__link pf-sidebar__link--category ${
                  hasActiveGroup ? 'pf-sidebar__link--active' : ''
                }`}
              >
                {category.title}
              </button>

              {category.groups.length > 0 && (
                <div className="pf-sidebar__subnav">
                  {category.groups.map((group) => {
                    const isActiveGroup = group.id === currentGroupId

                    return (
                      <button
                        key={group.id}
                        onClick={() => onGroupSelect(group.id)}
                        className={`pf-sidebar__link pf-sidebar__link--group ${
                          isActiveGroup ? 'pf-sidebar__link--active' : ''
                        }`}
                      >
                        {group.title}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
