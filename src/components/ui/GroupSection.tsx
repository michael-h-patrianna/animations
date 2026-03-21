import { getGroupAnimations } from '@/components/animationRegistry'
import { AnimationCard } from '@/components/ui/AnimationCard'
import { resolveAnimationSource } from '@/lib/groupBuilder'
import type { AnimationExport, Group } from '@/types/animation'
import React, { Suspense, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

interface GroupSectionProps {
  group: Group
  elementId: string
  /** When set, only the animation with this ID is shown. Invalid IDs produce an error banner. */
  animationFilter?: string
}

/**
 * Section component displaying a group of related animations in a card grid layout.
 *
 * Dynamically loads animation components from the registry based on the group ID,
 * automatically detecting whether to render Framer Motion or CSS implementations.
 * Supports infinite animations, lights controls, and lazy loading with Suspense.
 */
export function GroupSection({ group, elementId, animationFilter }: GroupSectionProps) {
  const isCssGroup = group.id.endsWith('-css')
  const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
  const currentTech = isCssGroup ? 'css' : 'framer'
  const navigate = useNavigate()

  const animationRegistry = useMemo(
    () => getGroupAnimations(baseGroupId, currentTech),
    [baseGroupId, currentTech]
  )

  const framerRegistry = useMemo(() => getGroupAnimations(baseGroupId, 'framer'), [baseGroupId])

  const cssRegistry = useMemo(() => getGroupAnimations(baseGroupId, 'css'), [baseGroupId])

  const filteredAnimations = useMemo(() => {
    if (!animationFilter) return group.animations
    return group.animations.filter((a) => a.id === animationFilter)
  }, [group.animations, animationFilter])

  const handleRemoveFilter = useCallback(() => {
    // Navigate to the same group without the query param
    navigate(`/${group.id}`, { replace: true })
  }, [navigate, group.id])

  const isFilterActive = Boolean(animationFilter)
  const isFilterInvalid = isFilterActive && filteredAnimations.length === 0

  return (
    <article id={elementId} className="pf-group" data-testid={`group-section-${elementId}`}>
      {isFilterActive && (
        <div className="pf-filter-banner" data-testid="filter-banner">
          <span>
            {isFilterInvalid
              ? `Animation "${animationFilter}" not found`
              : `Showing: ${animationFilter}`}
          </span>
          <button
            type="button"
            className="pf-filter-banner__remove"
            onClick={handleRemoveFilter}
            data-testid="remove-filter-btn"
          >
            Show all animations
          </button>
        </div>
      )}

      {isFilterInvalid ? null : filteredAnimations.length > 0 ? (
        <div className="pf-card-grid" data-testid="card-grid">
          {filteredAnimations.map((animation) => {
            const AnimationComponent = animationRegistry[animation.id]?.component

            return (
              <AnimationCardWithSource
                key={animation.id}
                animation={animation}
                AnimationComponent={AnimationComponent}
                animationRegistry={animationRegistry}
                framerEntry={framerRegistry[animation.id]}
                cssEntry={cssRegistry[animation.id]}
                isCssGroup={isCssGroup}
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
  isCssGroup: boolean
}

function AnimationCardWithSource({
  animation,
  AnimationComponent,
  animationRegistry,
  framerEntry,
  cssEntry,
  isCssGroup,
}: AnimationCardWithSourceProps) {
  const hasAnyEntry = Boolean(framerEntry ?? cssEntry)
  const sourceLoader = useCallback(
    () =>
      resolveAnimationSource(
        isCssGroup ? undefined : framerEntry,
        isCssGroup ? cssEntry : undefined
      ),
    [framerEntry, cssEntry, isCssGroup]
  )

  return (
    <AnimationCard
      title={animation.title}
      description={animation.description}
      animationId={animation.id}
      infiniteAnimation={animation.infinite}
      disableReplay={animation.disableReplay}
      controls={animation.controls}
      prizeCountMax={animation.prizeCountMax}
      previewPosition={animation.previewPosition}
      tier={animation.tier}
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
