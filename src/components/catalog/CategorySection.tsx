import { GroupSection } from '@/components/catalog/GroupSection';
import type { Category } from '@/types/animation';

interface CategorySectionProps {
  category: Category;
  elementId: string;
}

export function CategorySection({ category, elementId }: CategorySectionProps) {
  const animationCount = category.groups.reduce(
    (total, group) => total + group.animations.length,
    0
  );

  return (
    <section id={elementId} className="pf-category">
      <header className="pf-category__header">
        <div>
          <h1 className="pf-category__title">{category.title} ({animationCount} animations)</h1>
        </div>
      </header>

      <div className="pf-category__groups">
        {category.groups.length > 0 ? (
          category.groups.map((group) => (
            <GroupSection
              key={group.id}
              group={group}
              elementId={`group-${group.id}`}
            />
          ))
        ) : (
          <div className="pf-category__empty">Groups coming soon</div>
        )}
      </div>
    </section>
  );
}
