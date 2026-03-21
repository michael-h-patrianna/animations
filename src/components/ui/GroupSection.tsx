import { getGroupAnimations } from '@/components/animationRegistry'
import { AnimationCard } from '@/components/ui/AnimationCard'
import { resolveAnimationSource } from '@/lib/groupBuilder'
import type { AnimationExport, Group } from '@/types/animation'
import React, { Suspense, useCallback, useMemo } from 'react'

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
  const currentTech = isCssGroup ? 'css' : 'framer'

  const animationRegistry = useMemo(
    () => getGroupAnimations(baseGroupId, currentTech),
    [baseGroupId, currentTech]
  )

  const framerRegistry = useMemo(
    () => getGroupAnimations(baseGroupId, 'framer'),
    [baseGroupId]
  )

  const cssRegistry = useMemo(
    () => getGroupAnimations(baseGroupId, 'css'),
    [baseGroupId]
  )

  return (
    <article id={elementId} className="pf-group" data-testid={`group-section-${elementId}`}>
      <header className="pf-group__header">
        <div>
          <h2 className="pf-group__title" data-testid="group-title">
            {group.title} ({group.animations.length})
          </h2>
        </div>
      </header>

      {group.animations.length > 0 ? (
        <div className="pf-card-grid" data-testid="card-grid">
          {group.animations.map((animation) => {
            const AnimationComponent = animationRegistry[animation.id]?.component

            return (
              <AnimationCardWithSource
                key={animation.id}
                animation={animation}
                AnimationComponent={AnimationComponent}
                animationRegistry={animationRegistry}
                framerEntry={framerRegistry[animation.id]}
                cssEntry={cssRegistry[animation.id]}
              />
            )
          })}
        </div>
      ) : (
        <div className="pf-group__empty" data-testid="group-empty">
          Animations coming soon
        </div>
      )}
    </article>
  )
}

interface AnimationCardWithSourceProps {
  animation: Group['animations'][number]
  AnimationComponent: React.ComponentType<Record<string, unknown>> | undefined
  animationRegistry: Record<string, AnimationExport>
  framerEntry: AnimationExport | undefined
  cssEntry: AnimationExport | undefined
}

function AnimationCardWithSource({
  animation,
  AnimationComponent,
  animationRegistry,
  framerEntry,
  cssEntry,
}: AnimationCardWithSourceProps) {
  const hasAnyEntry = Boolean(framerEntry ?? cssEntry)
  const sourceLoader = useCallback(
    () => resolveAnimationSource(framerEntry, cssEntry),
    [framerEntry, cssEntry]
  )

  return (
    <AnimationCard
      title={animation.title}
      description={animation.description}
      animationId={animation.id}
      tags={animation.tags}
      infiniteAnimation={animation.infinite}
      disableReplay={animation.disableReplay}
      controls={animation.controls}
      prizeCountMax={animation.prizeCountMax}
      sourceLoader={hasAnyEntry ? sourceLoader : undefined}
    >
      {({ bulbCount, onColor, prizeCount }) => {
        return animation.id in animationRegistry && AnimationComponent ? (
          <Suspense fallback={<div className="pf-card__placeholder">Loading…</div>}>
            <AnimationComponent
              {...(animation.controls === 'lights' ? { numBulbs: bulbCount, onColor } : {})}
              {...(animation.controls === 'prizeCount' ? { prizeCount } : {})}
            />
          </Suspense>
        ) : (
          <div className="pf-card__placeholder">{animation.id}</div>
        )
      }}
    </AnimationCard>
  )
}
