import { categories } from '@/components/animationRegistry'
import { AnimationCard } from '@/components/ui/AnimationCard'
import type { Group } from '@/types/animation'
import React, { Suspense, useMemo } from 'react'

interface GroupSectionProps {
  group: Group
  elementId: string
}

/**
 * Section component displaying a group of related animations in a card grid layout.
 *
 * Dynamically loads animation components from the registry based on the group ID,
 * automatically detecting whether to render Framer Motion or CSS implementations.
 * Supports infinite animations, lights controls, and lazy loading with Suspense.
 *
 * @component
 * @param {GroupSectionProps} props - Component props
 * @param {Group} props.group - Group metadata containing animations, title, and ID
 * @param {string} props.elementId - HTML ID for scroll-to-section navigation
 */
export function GroupSection({ group, elementId }: GroupSectionProps) {
  const isCssGroup = group.id.endsWith('-css')
  const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')

  const animationRegistry = useMemo(() => {
    const registry: Record<string, React.ComponentType<Record<string, unknown>>> = {}

    for (const category of Object.values(categories)) {
      const groupExport = category.groups[baseGroupId]
      if (groupExport) {
        const animationSource = isCssGroup ? groupExport.css : groupExport.framer
        Object.entries(animationSource).forEach(([id, anim]) => {
          registry[id] = anim.component
        })
        break
      }
    }

    return registry
  }, [baseGroupId, isCssGroup])

  return (
    <article id={elementId} className="pf-group">
      <header className="pf-group__header">
        <div>
          <h2 className="pf-group__title" data-testid="group-title">
            {group.title} ({group.animations.length})
          </h2>
        </div>
      </header>

      {group.animations.length > 0 ? (
        <div className="pf-card-grid">
          {group.animations.map((animation) => {
            const AnimationComponent = animationRegistry[animation.id]

            return (
              <AnimationCard
                key={animation.id}
                title={animation.title}
                description={animation.description}
                animationId={animation.id}
                tags={animation.tags}
                infiniteAnimation={animation.infinite}
                disableReplay={animation.disableReplay}
                controls={animation.controls}
                prizeCountMax={animation.prizeCountMax}
              >
                {({ bulbCount, onColor, prizeCount }) => {
                  return AnimationComponent ? (
                    <Suspense fallback={<div className="pf-card__placeholder">Loading…</div>}>
                      <AnimationComponent
                        {...(animation.controls === 'lights'
                          ? { numBulbs: bulbCount, onColor }
                          : {})}
                        {...(animation.controls === 'prizeCount' ? { prizeCount } : {})}
                      />
                    </Suspense>
                  ) : (
                    <div className="pf-card__placeholder">{animation.id}</div>
                  )
                }}
              </AnimationCard>
            )
          })}
        </div>
      ) : (
        <div className="pf-group__empty">Animations coming soon</div>
      )}
    </article>
  )
}
