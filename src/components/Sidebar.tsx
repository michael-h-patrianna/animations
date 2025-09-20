import type { Category } from '@/types/animation';
import type { FC } from 'react';

interface SidebarProps {
  categories: Category[];
  currentCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
  onGroupSelect: (categoryId: string, groupId: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  categories,
  currentCategoryId,
  onCategorySelect,
  onGroupSelect,
}) => {
  return (
    <aside className="pf-sidebar">


      <div className="pf-sidebar__nav">
        {categories.map((category) => {
          const isActive = category.id === currentCategoryId;

          return (
            <div key={category.id} className="pf-sidebar__section">
              <button
                onClick={() => onCategorySelect(category.id)}
                className={`pf-sidebar__link pf-sidebar__link--category ${
                  isActive ? 'pf-sidebar__link--active' : ''
                }`}
              >
                {category.title}
              </button>

              {category.groups.length > 0 && (
                <div className="pf-sidebar__subnav">
                  {category.groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => onGroupSelect(category.id, group.id)}
                      className="pf-sidebar__link pf-sidebar__link--group"
                    >
                      {group.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
