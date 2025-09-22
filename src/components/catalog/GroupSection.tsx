import { animationRegistry } from '@/components/animationRegistry';
import { AnimationCard } from '@/components/catalog/AnimationCard';
import type { Group } from '@/types/animation';
import { Suspense } from 'react';

interface GroupSectionProps {
  group: Group;
  elementId: string;
}

// Helper function to determine if an animation should run infinitely
function isInfiniteAnimation(groupId: string, animationId: string): boolean {
  // All loading states should be infinite
  if (groupId === 'loading-states') return true;

  // Specific animations that should loop infinitely
  const infiniteAnimations = [
    // Timer effects that should continuously pulse/glow
    'timer-effects__timer-pulse',
    'timer-effects__timer-glow',
    'timer-effects__timer-breathe',

    // Update indicators that should continuously show activity
    'update-indicators__live-ping',
    'update-indicators__badge-pulse',
    'update-indicators__notification-dot',

    // Realtime data animations
    'realtime-data__live-score-update',
    'realtime-data__currency-update',
    'realtime-data__win-ticker',
      ];

  return infiniteAnimations.includes(animationId);
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
            const infiniteAnimation = isInfiniteAnimation(group.id, animation.id);

            return (
              <AnimationCard
                key={animation.id}
                title={animation.title}
                description={animation.description}
                animationId={animation.id}
                tags={animation.tags}
                infiniteAnimation={infiniteAnimation}
                disableReplay={animation.disableReplay}
              >
                {AnimationComponent ? (
                  <Suspense fallback={<div className="pf-card__placeholder">Loading…</div>}>
                    <AnimationComponent />
                  </Suspense>
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
