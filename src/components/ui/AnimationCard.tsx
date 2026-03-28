import { CardModals } from '@/components/ui/CardModals'
import {
  renderAnimationChild,
  useCardModalState,
  type AnimationChild,
} from '@/components/ui/useCardModalState'
import type { AnimationControlType, PreviewPosition, SourceTab } from '@/types/animation'
import { useRenderProfile } from '@/hooks/useRenderProfile'
import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import React from 'react'
import { ProfilerWrapper } from './ProfilerWrapper'
import { FooterControls } from './AnimationCardControls'
import { CardHeaderBar } from './AnimationCardHeader'
import { useCardControls } from './useCardControls'
import { useCardPlayback } from './useCardPlayback'

interface AnimationCardProps {
  title: string
  description: string
  animationId: string
  onReplay?: () => void
  infiniteAnimation?: boolean
  disableReplay?: boolean
  controls?: AnimationControlType
  prizeCountMax?: number
  previewPosition?: PreviewPosition
  tier?: 1 | 2 | 3 | 4
  /** Freeform tags displayed as pills in the card footer. */
  tags?: string[]
  /** Max width (px) for demo canvas and preview. Prevents wide animations from stretching. */
  previewMaxWidth?: number
  children: AnimationChild
  /** Lazy loader that resolves source tabs for the code viewer */
  sourceLoader?: () => Promise<SourceTab[]>
  /** Shared prop overrides driven by the inspector panel. */
  propOverrides?: Record<string, unknown>
  /** True when the card is the active inspector target. */
  selected?: boolean
  /** Select this card for editing in the inspector. */
  onSelect?: () => void
  /** External replay signal driven by the inspector. */
  externalReplayVersion?: number
  /** When true, inspector props replace footer control groups. */
  hasInspectorProps?: boolean
}

const EMPTY_OVERRIDES: Record<string, unknown> = {}
const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, label, [role="switch"], [role="radio"], [data-ignore-card-select]'

/** Orchestrates all card-level hooks into a single state bundle. */
function useAnimationCard(props: AnimationCardProps) {
  const { animationId, infiniteAnimation = false, onReplay, sourceLoader } = props
  const playback = useCardPlayback(infiniteAnimation, onReplay)
  const [isExpanded, setIsExpanded] = useState(false)
  const cardControls = useCardControls(playback.setReplayKey)
  const { codeViewer, preview, opaque, handleCopyLink } = useCardModalState(
    animationId,
    sourceLoader
  )
  const { profile: renderProfile, onRender: onProfilerRender } = useRenderProfile()

  return {
    playback,
    isExpanded,
    setIsExpanded,
    cardControls,
    codeViewer,
    preview,
    opaque,
    handleCopyLink,
    renderProfile,
    onProfilerRender,
  }
}

/** Demo canvas with replay key — remounts children on replay. */
function CardCanvas({
  previewMaxWidth,
  replayKey,
  children,
}: {
  previewMaxWidth?: number
  replayKey: number
  children: ReactNode
}) {
  return (
    <div className="py-3">
      <div
        className="pf-demo-canvas"
        style={
          previewMaxWidth !== undefined
            ? ({ '--pf-preview-max-width': `${previewMaxWidth}px` } as React.CSSProperties)
            : undefined
        }
        data-testid="card-canvas"
      >
        <div key={replayKey} className="pf-demo-stage pf-demo-stage--top" data-testid="demo-stage">
          {children}
        </div>
      </div>
    </div>
  )
}

function useCardSelection(onSelect: (() => void) | undefined) {
  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (onSelect == null) return
      const target = event.target
      if (target instanceof HTMLElement && target.closest(INTERACTIVE_SELECTOR)) return
      onSelect()
    },
    [onSelect]
  )

  const handleCardKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onSelect == null) return
      if (event.currentTarget !== event.target) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect()
      }
    },
    [onSelect]
  )

  return { handleSelect, handleCardKeyDown }
}

function CardBody({
  card,
  props,
  effectiveControlType,
}: {
  card: ReturnType<typeof useAnimationCard>
  props: AnimationCardProps
  effectiveControlType: AnimationControlType | undefined
}) {
  const {
    title,
    description,
    animationId,
    children,
    tier,
    previewMaxWidth,
    sourceLoader,
    propOverrides = EMPTY_OVERRIDES,
    selected = false,
    onSelect,
    infiniteAnimation = false,
    disableReplay = false,
    prizeCountMax,
    previewPosition,
  } = props
  const { handleSelect, handleCardKeyDown } = useCardSelection(onSelect)

  return (
    <div
      className={`pf-card glass-panel outline-none ${onSelect != null ? 'pf-card--selectable' : ''} ${selected ? 'pf-card--selected' : ''}`}
      data-animation-id={animationId}
      data-selected={selected || undefined}
      ref={card.playback.cardRef}
      onClick={handleSelect}
      onKeyDown={handleCardKeyDown}
      tabIndex={onSelect != null ? 0 : undefined}
    >
      <span className="pf-card__overlay" aria-hidden="true" />
      <CardHeaderBar
        title={title}
        description={description}
        isExpanded={card.isExpanded}
        onToggle={() => card.setIsExpanded((v) => !v)}
        onCopyLink={card.handleCopyLink}
        onOpenCode={sourceLoader ? card.codeViewer.open : undefined}
        onOpenDesktopPreview={card.preview.openDesktop}
        onOpenMobilePreview={card.preview.openMobile}
      />
      <CardCanvas previewMaxWidth={previewMaxWidth} replayKey={card.playback.replayKey}>
        <ProfilerWrapper id={animationId} onRender={card.onProfilerRender}>
          {renderAnimationChild(
            children,
            card.playback.isVisible,
            infiniteAnimation,
            card.cardControls.bulbCount,
            card.cardControls.onColor,
            card.cardControls.prizeCount,
            propOverrides
          )}
        </ProfilerWrapper>
      </CardCanvas>
      <FooterControls
        cardControls={card.cardControls}
        controlType={effectiveControlType}
        prizeCountMax={prizeCountMax}
        tier={tier}
        tags={props.tags}
        disableReplay={disableReplay}
        onReplay={card.playback.triggerReplay}
        renderProfile={card.renderProfile}
      />
      <CardModals
        title={title}
        codeViewer={card.codeViewer}
        preview={card.preview}
        previewPosition={previewPosition ?? 'center'}
        opaque={card.opaque}
        previewMaxWidth={previewMaxWidth}
        controlProps={card.cardControls}
        propOverrides={propOverrides}
      >
        {children}
      </CardModals>
    </div>
  )
}

function AnimationCardComponent(props: AnimationCardProps) {
  const { externalReplayVersion = 0, hasInspectorProps = false, controls: controlType } = props
  const card = useAnimationCard(props)
  const effectiveControlType = hasInspectorProps ? undefined : controlType
  const { triggerReplay } = card.playback
  const previousReplayVersionRef = useRef(externalReplayVersion)

  useEffect(() => {
    if (externalReplayVersion === previousReplayVersionRef.current) return
    previousReplayVersionRef.current = externalReplayVersion
    triggerReplay()
  }, [externalReplayVersion, triggerReplay])

  return <CardBody card={card} props={props} effectiveControlType={effectiveControlType} />
}

export const AnimationCard = memo(AnimationCardComponent)
