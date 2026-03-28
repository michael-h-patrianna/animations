import { getGroupAnimations } from '@/components/animationRegistry'
import { DemoModeWrapper } from '@/components/ui/DemoModeWrappers'
import { AnimationCard } from '@/components/ui/AnimationCard'
import { useAnimationInspector } from '@/contexts/AnimationInspectorContext'
import { LoadingSpinner } from '@/demo-ui/components/ui/LoadingSpinner'
import { useLayoutStore } from '@/demo-ui/stores/layoutStore'
import { resolveAnimationSource } from '@/lib/groupBuilder'
import type { AnimationExport, Group } from '@/types/animation'
import React, { Suspense, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

interface GroupSectionProps {
  group: Group
  elementId: string
  /** When set, only the animation with this ID is shown. Invalid IDs produce an error banner. */
  animationFilter?: string
  /** True while a group transition is pending (React 19 useTransition) */
  isPending?: boolean
  /** Error if loading failed */
  error?: Error
}

const groupSectionClassName = 'flex w-full flex-col gap-4 px-2 pb-2'

const groupSectionStateClassName = `${groupSectionClassName} min-h-[240px] items-center justify-center`

/** Renders loading state for group section. */
function LoadingState({ elementId }: { elementId: string }) {
  return (
    <article
      id={elementId}
      className={groupSectionStateClassName}
      data-testid={`group-section-${elementId}`}
    >
      <div className="glass-panel flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border border-border-subtle bg-(--bg-surface)/35 px-5 py-6 text-text-secondary">
        <LoadingSpinner size={18} />
        <span className="text-sm font-medium">Loading animations...</span>
      </div>
    </article>
  )
}

/** Renders error state for group section. */
function ErrorState({ elementId, error }: { elementId: string; error: Error }) {
  return (
    <article
      id={elementId}
      className={groupSectionStateClassName}
      data-testid={`group-section-${elementId}`}
    >
      <div className="w-full max-w-xl rounded-2xl border border-danger-border bg-(--bg-danger)/40 px-5 py-4 text-center">
        <h3 className="text-sm font-semibold text-text-danger">Failed to load animations</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{error.message}</p>
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
  isPending,
  error,
}: GroupSectionProps) {
  if (isPending) {
    return <LoadingState elementId={elementId} />
  }

  if (error) {
    return <ErrorState elementId={elementId} error={error} />
  }

  return <GroupContent group={group} elementId={elementId} animationFilter={animationFilter} />
}

/** Renders the main group content with animation cards. */
/** Resolves animation registries and filter state for a group. */
function useGroupContentState(group: Group, animationFilter?: string) {
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

  const { selectAnimation, isSelected, getPropOverrides, getReplayVersion } =
    useAnimationInspector()
  const setRightPanel = useLayoutStore((state) => state.setRightPanel)

  const handleSelectAnimation = useCallback(
    (animation: Group['animations'][number]) => {
      selectAnimation(animation)
      setRightPanel(true)
    },
    [selectAnimation, setRightPanel]
  )

  return {
    isCssGroup,
    animationRegistry,
    framerRegistry,
    cssRegistry,
    filteredAnimations,
    handleRemoveFilter,
    isSelected,
    getPropOverrides,
    getReplayVersion,
    handleSelectAnimation,
    isFilterActive: Boolean(animationFilter),
    isFilterInvalid: Boolean(animationFilter) && filteredAnimations.length === 0,
  }
}

function GroupContent({
  group,
  elementId,
  animationFilter,
}: Omit<GroupSectionProps, 'isPending' | 'error'>) {
  const state = useGroupContentState(group, animationFilter)

  return (
    <article
      id={elementId}
      className={groupSectionClassName}
      data-testid={`group-section-${elementId}`}
    >
      {state.isFilterActive && (
        <div className="pf-filter-banner" data-testid="filter-banner">
          <span>
            {state.isFilterInvalid
              ? `Animation "${animationFilter}" not found`
              : `Showing: ${animationFilter}`}
          </span>
          <button
            type="button"
            className="pf-filter-banner__remove"
            onClick={state.handleRemoveFilter}
            data-testid="remove-filter-btn"
          >
            Show all animations
          </button>
        </div>
      )}

      {state.isFilterInvalid ? null : state.filteredAnimations.length > 0 ? (
        <div className="pf-card-grid" data-testid="card-grid">
          {state.filteredAnimations.map((animation) => {
            const AnimationComponent = state.animationRegistry[animation.id]?.component

            return (
              <AnimationCardWithSource
                key={animation.id}
                animation={animation}
                AnimationComponent={AnimationComponent}
                animationRegistry={state.animationRegistry}
                framerEntry={state.framerRegistry[animation.id]}
                cssEntry={state.cssRegistry[animation.id]}
                isCssGroup={state.isCssGroup}
                selected={state.isSelected(animation.id)}
                propOverrides={state.getPropOverrides(animation.id, animation.props)}
                replayVersion={state.getReplayVersion(animation.id)}
                onSelect={() => state.handleSelectAnimation(animation)}
              />
            )
          })}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed border-border-subtle bg-(--bg-surface)/20 px-4 py-10 text-center text-sm italic text-text-tertiary"
          data-testid="group-empty"
        >
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
  selected: boolean
  propOverrides: Record<string, unknown>
  replayVersion: number
  onSelect: () => void
}

function AnimationCardWithSource({
  animation,
  AnimationComponent,
  animationRegistry,
  framerEntry,
  cssEntry,
  isCssGroup,
  selected,
  propOverrides,
  replayVersion,
  onSelect,
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
      tags={animation.tags}
      previewMaxWidth={animation.previewMaxWidth}
      sourceLoader={hasAnyEntry ? sourceLoader : undefined}
      propOverrides={propOverrides}
      selected={selected}
      onSelect={onSelect}
      externalReplayVersion={replayVersion}
      hasInspectorProps={animation.props != null}
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
