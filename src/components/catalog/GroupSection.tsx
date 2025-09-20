import { animationRegistry } from '@/components/animationRegistry';
import { AnimationCard } from '@/components/catalog/AnimationCard';
import type { Group } from '@/types/animation';

interface GroupSectionProps {
  group: Group;
  elementId: string;
}

export function GroupSection({ group, elementId }: GroupSectionProps) {
  return (
    <article id={elementId} className="pf-group">
      <header className="pf-group__header">
        <div>
          <h2 className="pf-group__title">{group.title} ({group.animations.length})</h2>
        </div>
      </header>

      {group.animations.length > 0 ? (
        <div className="pf-card-grid">
          {group.animations.map((animation) => {
            const AnimationComponent = animationRegistry[animation.id];

            return (
              <AnimationCard
                key={animation.id}
                title={animation.title}
                description={animation.description}
                animationId={animation.id}
              >
                {AnimationComponent ? (
                  <AnimationComponent />
                ) : (
                  <div className="pf-card__placeholder">{animation.id}</div>
                )}
              </AnimationCard>
            );
          })}
        </div>
      ) : (
        <div className="pf-group__empty">Animations coming soon</div>
      )}
    </article>
  );
}
