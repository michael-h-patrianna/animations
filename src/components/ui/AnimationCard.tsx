import { Card, CardContent } from '@/components/ui/card'
import { CodeViewerModal } from '@/components/ui/CodeViewerModal'
import { PreviewModal } from '@/components/ui/PreviewModal'
import { useToast } from '@/components/ui/useToast'
import type { AnimationControlType, PreviewPosition, SourceTab } from '@/types/animation'
import { memo, useCallback, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
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
  children,
  controlProps,
}: {
  title: string
  codeViewer: ReturnType<typeof useCodeViewer>
  preview: ReturnType<typeof usePreviewModal>
  previewPosition: PreviewPosition
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

function useCopyLink(animationId: string) {
  const { showToast, toastPortal } = useToast()
  const location = useLocation()

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}${location.pathname}?animation=${encodeURIComponent(animationId)}`
    navigator.clipboard.writeText(url).then(() => {
      showToast('Animation URL copied to clipboard')
    })
  }, [animationId, showToast, location.pathname])

  return { handleCopyLink, toastPortal }
}

const AnimationCardComponent = ({
  title,
  description,
  animationId,
  children,
  onReplay,
  infiniteAnimation = false,
  disableReplay = false,
  controls: controlType,
  prizeCountMax,
  previewPosition,
  tier,
  sourceLoader,
}: AnimationCardProps) => {
  const { cardRef, replayKey, isVisible, triggerReplay, setReplayKey } = useCardPlayback(
    infiniteAnimation,
    onReplay
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const cardControls = useCardControls(setReplayKey)
  const codeViewer = useCodeViewer(sourceLoader)
  const preview = usePreviewModal()
  const { handleCopyLink, toastPortal } = useCopyLink(animationId)

  return (
    <Card className="pf-card" data-animation-id={animationId} ref={cardRef}>
      <span className="pf-card__overlay" aria-hidden="true" />
      <CardHeaderBar
        title={title}
        description={description}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((expanded) => !expanded)}
        onCopyLink={handleCopyLink}
        onOpenCode={sourceLoader ? codeViewer.open : undefined}
        onOpenDesktopPreview={preview.openDesktop}
        onOpenMobilePreview={preview.openMobile}
      />
      <CardContent className="p-0 py-3">
        <div className="pf-demo-canvas" data-testid="card-canvas">
          <div
            key={replayKey}
            className="pf-demo-stage pf-demo-stage--top"
            data-testid="demo-stage"
          >
            {renderAnimationChild(
              children,
              isVisible,
              infiniteAnimation,
              cardControls.bulbCount,
              cardControls.onColor,
              cardControls.prizeCount
            )}
          </div>
        </div>
      </CardContent>
      <FooterControls
        cardControls={cardControls}
        controlType={controlType}
        prizeCountMax={prizeCountMax}
        tier={tier}
        disableReplay={disableReplay}
        onReplay={triggerReplay}
      />
      <CardModals
        title={title}
        codeViewer={codeViewer}
        preview={preview}
        previewPosition={previewPosition ?? 'center'}
        controlProps={cardControls}
      >
        {children}
      </CardModals>
      {toastPortal}
    </Card>
  )
}

export const AnimationCard = memo(AnimationCardComponent)
