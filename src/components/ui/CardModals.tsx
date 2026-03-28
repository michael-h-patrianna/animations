/**
 * Portaled modals rendered outside the AnimationCard DOM.
 * Code viewer and viewport preview overlays.
 */

import { CodeViewerModal } from '@/components/ui/CodeViewerModal'
import { PreviewModal } from '@/components/ui/PreviewModal'
import { renderAnimationChild, type AnimationChild } from '@/components/ui/useCardModalState'
import type { PreviewPosition } from '@/types/animation'
import { createPortal } from 'react-dom'
import type { useCodeViewer } from './useCodeViewer'
import { type PreviewMode, type usePreviewModal } from './usePreviewModal'

interface CardModalsProps {
  title: string
  codeViewer: ReturnType<typeof useCodeViewer>
  preview: ReturnType<typeof usePreviewModal>
  previewPosition: PreviewPosition
  opaque: boolean
  previewMaxWidth?: number
  children: AnimationChild
  controlProps: { bulbCount: number; onColor: string; prizeCount: number }
  propOverrides: Record<string, unknown>
}

/**
 * Portaled modals rendered outside the card DOM.
 * Renders code viewer + viewport preview via createPortal.
 */
export function CardModals({
  title,
  codeViewer,
  preview,
  previewPosition,
  opaque,
  previewMaxWidth,
  children,
  controlProps,
  propOverrides,
}: CardModalsProps) {
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
