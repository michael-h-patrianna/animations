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
}

const renderAnimationChild = (
  child: AnimationChild,
  isVisible: boolean,
  infiniteAnimation: boolean,
  bulbCount: number,
  onColor: string,
  prizeCount: number
) => {
  if (!isVisible && !infiniteAnimation) return null
  if (typeof child === 'function') return child({ bulbCount, onColor, prizeCount })
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
}: {
  title: string
  codeViewer: ReturnType<typeof useCodeViewer>
  preview: ReturnType<typeof usePreviewModal>
  previewPosition: PreviewPosition
  opaque: boolean
  previewMaxWidth?: number
  children: AnimationChild
  controlProps: AnimationRenderProps
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
              controlProps.prizeCount
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

function AnimationCardComponent(props: AnimationCardProps) {
  const { title, description, animationId, children, tier, previewMaxWidth, sourceLoader } = props
  const {
    infiniteAnimation = false,
    disableReplay = false,
    controls: controlType,
    prizeCountMax,
    previewPosition,
  } = props
  const card = useAnimationCard(props)

  return (
    <div className="pf-card" data-animation-id={animationId} ref={card.playback.cardRef}>
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
          <div
            key={card.playback.replayKey}
            className="pf-demo-stage pf-demo-stage--top"
            data-testid="demo-stage"
          >
            {renderAnimationChild(
              children,
              card.playback.isVisible,
              infiniteAnimation,
              card.cardControls.bulbCount,
              card.cardControls.onColor,
              card.cardControls.prizeCount
            )}
          </div>
        </div>
      </div>
      <FooterControls
        cardControls={card.cardControls}
        controlType={controlType}
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
      >
        {children}
      </CardModals>
      {card.toastPortal}
    </div>
  )
}

export const AnimationCard = memo(AnimationCardComponent)
