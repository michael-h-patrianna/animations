import { CodeViewerModal } from '@/components/ui/CodeViewerModal'
import { PreviewModal } from '@/components/ui/PreviewModal'
import { useToast } from '@/components/ui/useToast'
import { logger } from '@/services/logger'
import type { AnimationControlType, PreviewPosition, SourceTab } from '@/types/animation'
import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useSearchParams } from 'react-router-dom'
import { FooterControls } from './AnimationCardControls'
import { CardHeaderBar } from './AnimationCardHeader'
import { useCardControls } from './useCardControls'
import { useCodeViewer } from './useCodeViewer'
import { useCardPlayback } from './useCardPlayback'
import { usePreviewModal, type PreviewMode } from './usePreviewModal'

type AnimationRenderProps = {
  bulbCount: number
  onColor: string
  prizeCount: number
  /** Prop overrides from the shared inspector panel. */
  propOverrides: Record<string, unknown>
}

type AnimationChild = ReactNode | ((props: AnimationRenderProps) => ReactNode)

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

const renderAnimationChild = (
  child: AnimationChild,
  isVisible: boolean,
  infiniteAnimation: boolean,
  bulbCount: number,
  onColor: string,
  prizeCount: number,
  propOverrides: Record<string, unknown> = EMPTY_OVERRIDES
) => {
  if (!isVisible && !infiniteAnimation) return null
  if (typeof child === 'function') return child({ bulbCount, onColor, prizeCount, propOverrides })
  return child
}

/** Portaled modals rendered outside the card DOM (code viewer + viewport preview). */
function CardModals({
  title,
  codeViewer,
  preview,
  previewPosition,
  opaque,
  previewMaxWidth,
  children,
  controlProps,
  propOverrides,
}: {
  title: string
  codeViewer: ReturnType<typeof useCodeViewer>
  preview: ReturnType<typeof usePreviewModal>
  previewPosition: PreviewPosition
  opaque: boolean
  previewMaxWidth?: number
  children: AnimationChild
  controlProps: { bulbCount: number; onColor: string; prizeCount: number }
  propOverrides: Record<string, unknown>
}) {
  const handleSwitchMode = (mode: PreviewMode) => {
    if (mode === 'desktop') preview.openDesktop()
    else preview.openMobile()
  }

  return (
    <>
      {codeViewer.isOpen &&
        codeViewer.sources &&
        codeViewer.sources.length > 0 &&
        createPortal(
          <CodeViewerModal sources={codeViewer.sources} title={title} onClose={codeViewer.close} />,
          document.body
        )}
      {preview.isOpen &&
        createPortal(
          <PreviewModal
            mode={preview.mode}
            replayKey={preview.replayKey}
            previewPosition={previewPosition}
            opaque={opaque}
            previewMaxWidth={previewMaxWidth}
            onClose={preview.close}
            onReplay={preview.replay}
            onSwitchMode={handleSwitchMode}
          >
            {renderAnimationChild(
              children,
              true,
              true,
              controlProps.bulbCount,
              controlProps.onColor,
              controlProps.prizeCount,
              propOverrides
            )}
          </PreviewModal>,
          document.body
        )}
    </>
  )
}

/** Auto-open preview when URL contains ?animation=X&preview=desktop|mobile&opaque=1 */
function useAutoPreview(animationId: string, preview: ReturnType<typeof usePreviewModal>) {
  const [searchParams] = useSearchParams()
  const previewParam = searchParams.get('preview')
  const opaque = searchParams.get('opaque') === '1'
  const autoOpenedRef = useRef(false)

  useEffect(() => {
    if (autoOpenedRef.current) return
    const animParam = searchParams.get('animation')
    if (animParam !== animationId || !previewParam) return
    autoOpenedRef.current = true
    if (previewParam === 'mobile') preview.openMobile()
    else preview.openDesktop()
  }, [searchParams, animationId, previewParam, preview])

  return { opaque }
}

function useCopyLink(animationId: string) {
  const { showToast, toastPortal } = useToast()
  const location = useLocation()

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}${location.pathname}?animation=${encodeURIComponent(animationId)}`
    navigator.clipboard.writeText(url).then(
      () => showToast('Animation URL copied to clipboard'),
      (err) => logger.warn('Clipboard write failed — browser may have denied access', err)
    )
  }, [animationId, showToast, location.pathname])

  return { handleCopyLink, toastPortal }
}

/** Orchestrates all card-level hooks into a single state bundle. */
function useAnimationCard(props: AnimationCardProps) {
  const { animationId, infiniteAnimation = false, onReplay, sourceLoader } = props
  const playback = useCardPlayback(infiniteAnimation, onReplay)
  const [isExpanded, setIsExpanded] = useState(false)
  const cardControls = useCardControls(playback.setReplayKey)
  const codeViewer = useCodeViewer(sourceLoader)
  const preview = usePreviewModal()
  const { opaque } = useAutoPreview(animationId, preview)
  const { handleCopyLink, toastPortal } = useCopyLink(animationId)
  const { showToast } = useToast()

  // Surface code-viewer load errors as a toast
  useEffect(() => {
    if (codeViewer.error) showToast(`Failed to load source: ${codeViewer.error}`)
  }, [codeViewer.error, showToast])

  return {
    playback,
    isExpanded,
    setIsExpanded,
    cardControls,
    codeViewer,
    preview,
    opaque,
    handleCopyLink,
    toastPortal,
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
      className={`pf-card glass-panel outline-none ${onSelect != null ? 'pf-card--selectable' : ''} ${
        selected ? 'pf-card--selected' : ''
      }`}
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
        {renderAnimationChild(
          children,
          card.playback.isVisible,
          infiniteAnimation,
          card.cardControls.bulbCount,
          card.cardControls.onColor,
          card.cardControls.prizeCount,
          propOverrides
        )}
      </CardCanvas>
      <FooterControls
        cardControls={card.cardControls}
        controlType={effectiveControlType}
        prizeCountMax={prizeCountMax}
        tier={tier}
        disableReplay={disableReplay}
        onReplay={card.playback.triggerReplay}
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
      {card.toastPortal}
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
