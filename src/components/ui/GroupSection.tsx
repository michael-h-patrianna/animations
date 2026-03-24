import { homeIcon1 } from '@/assets'
import { getGroupAnimations } from '@/components/animationRegistry'
import { DemoAnchors } from '@/components/rewards/collection-effects/MockDemoAnchors'
import { AnimationCard } from '@/components/ui/AnimationCard'
import { resolveAnimationSource } from '@/lib/groupBuilder'
import type { AnimationExport, Group } from '@/types/animation'
import React, { Suspense, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface GroupSectionProps {
  group: Group
  elementId: string
  /** When set, only the animation with this ID is shown. Invalid IDs produce an error banner. */
  animationFilter?: string
  /** Whether the group is currently loading */
  isLoading?: boolean
  /** Error if loading failed */
  error?: Error
}

/** Renders loading state for group section. */
function LoadingState({ elementId }: { elementId: string }) {
  return (
    <article id={elementId} className="pf-group pf-group--loading" data-testid={`group-section-${elementId}`}>
      <div className="pf-group-loading">
        <div className="pf-group-loading__spinner" />
        <span className="pf-group-loading__text">Loading animations...</span>
      </div>
    </article>
  )
}

/** Renders error state for group section. */
function ErrorState({ elementId, error }: { elementId: string; error: Error }) {
  return (
    <article id={elementId} className="pf-group pf-group--error" data-testid={`group-section-${elementId}`}>
      <div className="pf-group-error">
        <h3 className="pf-group-error__title">Failed to load animations</h3>
        <p className="pf-group-error__message">{error.message}</p>
      </div>
    </article>
  )
}

/**
 * Section component displaying a group of related animations in a card grid layout.
 *
 * Dynamically loads animation components from the registry based on the group ID,
 * automatically detecting whether to render Framer Motion or CSS implementations.
 * Supports infinite animations, lights controls, and lazy loading with Suspense.
 */
export function GroupSection({
  group,
  elementId,
  animationFilter,
  isLoading,
  error,
}: GroupSectionProps) {
  if (isLoading) {
    return <LoadingState elementId={elementId} />
  }

  if (error) {
    return <ErrorState elementId={elementId} error={error} />
  }

  return <GroupContent group={group} elementId={elementId} animationFilter={animationFilter} />
}

/** Renders the main group content with animation cards. */
function GroupContent({
  group,
  elementId,
  animationFilter,
}: Omit<GroupSectionProps, 'isLoading' | 'error'>) {
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
      previewMaxWidth={animation.previewMaxWidth}
      sourceLoader={hasAnyEntry ? sourceLoader : undefined}
      propsConfig={animation.props}
    >
      {({ bulbCount, onColor, prizeCount, propOverrides }) => {
        if (!(animation.id in animationRegistry) || AnimationComponent === undefined) {
          return <div className="pf-card__placeholder">{animation.id}</div>
        }

        const controlProps = {
          ...(animation.controls === 'lights' ? { numBulbs: bulbCount, onColor } : {}),
          ...(animation.controls === 'prizeCount' ? { prizeCount } : {}),
          ...propOverrides,
        }

        if (animation.demoMode !== undefined) {
          return (
            <Suspense fallback={<div className="pf-card__placeholder">Loading…</div>}>
              <DemoModeWrapper
                mode={animation.demoMode}
                Component={AnimationComponent}
                controlProps={controlProps}
              />
            </Suspense>
          )
        }

        return (
          <Suspense fallback={<div className="pf-card__placeholder">Loading…</div>}>
            <AnimationComponent {...controlProps} />
          </Suspense>
        )
      }}
    </AnimationCard>
  )
}

/**
 * Wraps an animation component with demo anchor UI for the catalog.
 * Renders Source/Target pills at random positions and passes their refs
 * as `from`/`to` props to the animation component.
 */
function DemoModeWrapper({
  mode,
  Component,
  controlProps,
}: {
  mode: 'burst' | 'magnet' | 'trail' | 'fountain' | 'icon-dot' | 'status-row'
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}) {
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)

  if (mode === 'icon-dot') {
    return <IconDotDemo Component={Component} controlProps={controlProps} />
  }

  if (mode === 'status-row') {
    return <StatusRowDemo Component={Component} controlProps={controlProps} />
  }

  const isParticleMode =
    mode === 'burst' || mode === 'magnet' || mode === 'trail' || mode === 'fountain'
  const particleProps = isParticleMode
    ? { particleImages: ['/images/coin-particle.png'], particleSize: 50 }
    : {}

  return (
    <>
      <DemoAnchors fromRef={fromRef} toRef={toRef} mode={mode} />
      <Component {...controlProps} {...particleProps} from={fromRef} to={toRef} />
    </>
  )
}

/** Renders a demo icon with the dot-indicator component overlaid. */
function IconDotDemo({
  Component,
  controlProps,
}: {
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}) {
  return (
    <div className="pf-demo-icon-dot" data-testid="demo-icon-dot">
      <Component {...controlProps}>
        <img src={homeIcon1} alt="Home" className="pf-demo-icon-dot__icon" />
      </Component>
    </div>
  )
}

/** Renders a status row (dot + text) with the badge/ping component at the end. */
function StatusRowDemo({
  Component,
  controlProps,
}: {
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}) {
  return (
    <div className="pf-demo-status-row" data-testid="demo-status-row">
      <span className="pf-demo-status-row__dot" data-testid="demo-status-row-dot" />
      <span className="pf-demo-status-row__text" data-testid="demo-status-row-text">
        Content update arrived
      </span>
      <Component {...controlProps} />
    </div>
  )
}
