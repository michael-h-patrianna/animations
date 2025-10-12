import type { Category } from '@/types/animation'
import type { FC } from 'react'

interface AppSidebarProps {
  categories: Category[]
  currentGroupId: string
  onCategorySelect: (categoryId: string) => void
  onGroupSelect: (groupId: string) => void
  className?: string
}

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
