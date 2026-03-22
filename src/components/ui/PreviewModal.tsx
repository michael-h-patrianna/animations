import { CloseIcon } from '@/components/ui/icons/CloseIcon'
import { MonitorIcon } from '@/components/ui/icons/MonitorIcon'
import { SmartphoneIcon } from '@/components/ui/icons/SmartphoneIcon'
import { useEscapeClose, useFocusTrap, useOverlayDismiss } from '@/hooks/useModalAccessibility'
import type { PreviewPosition } from '@/types/animation'
import { memo, useRef, type ReactNode } from 'react'
import type { PreviewMode } from './usePreviewModal'
import './PreviewModal.css'

interface PreviewModalProps {
  mode: PreviewMode
  replayKey: number
  previewPosition: PreviewPosition
  /** When true, renders an opaque black background instead of semi-transparent overlay. */
  opaque?: boolean
  onClose: () => void
  onReplay: () => void
  onSwitchMode: (mode: PreviewMode) => void
  children: ReactNode
}

// ── Sub-components ─────────────────────────────────────────────────────

function Toolbar({
  onReplay,
  onClose,
  closeButtonRef,
}: {
  onReplay: () => void
  onClose: () => void
  closeButtonRef: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <div className="preview-toolbar" data-testid="preview-toolbar">
      <button
        type="button"
        className="preview-toolbar__btn"
        onClick={onReplay}
        aria-label="Replay animation"
        data-testid="preview-replay-btn"
      >
        Replay
      </button>
      <button
        type="button"
        className="preview-toolbar__btn"
        onClick={onClose}
        ref={closeButtonRef}
        aria-label="Close preview"
        data-testid="preview-close-btn"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

function ModeSwitch({
  mode,
  onSwitchMode,
}: {
  mode: PreviewMode
  onSwitchMode: (mode: PreviewMode) => void
}) {
  return (
    <div className="preview-mode-switch" data-testid="preview-mode-switch">
      <button
        type="button"
        className={`preview-mode-switch__btn ${mode === 'desktop' ? 'preview-mode-switch__btn--active' : ''}`}
        onClick={() => onSwitchMode('desktop')}
        aria-label="Desktop preview"
        aria-pressed={mode === 'desktop'}
        data-testid="preview-mode-desktop"
      >
        <MonitorIcon /> Desktop
      </button>
      <button
        type="button"
        className={`preview-mode-switch__btn ${mode === 'mobile' ? 'preview-mode-switch__btn--active' : ''}`}
        onClick={() => onSwitchMode('mobile')}
        aria-label="Mobile preview"
        aria-pressed={mode === 'mobile'}
        data-testid="preview-mode-mobile"
      >
        <SmartphoneIcon /> Mobile
      </button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────

function PreviewModalComponent({
  mode,
  replayKey,
  previewPosition,
  opaque = false,
  onClose,
  onReplay,
  onSwitchMode,
  children,
}: PreviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(overlayRef, closeButtonRef)
  useEscapeClose(onClose)
  const handleOverlayClick = useOverlayDismiss(overlayRef, onClose)

  const position = previewPosition

  return (
    <div
      className={`preview-overlay${opaque ? ' preview-overlay--opaque' : ''}`}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${mode === 'desktop' ? 'Desktop' : 'Mobile'} animation preview`}
      data-testid={`preview-${mode}`}
    >
      <ModeSwitch mode={mode} onSwitchMode={onSwitchMode} />
      <Toolbar onReplay={onReplay} onClose={onClose} closeButtonRef={closeButtonRef} />

      {mode === 'mobile' ? (
        <div className="preview-mobile-frame" data-testid="preview-mobile-frame">
          <div className="preview-mobile-screen">
            <div
              className="preview-animation"
              data-position={position}
              data-testid="preview-animation"
            >
              <div key={replayKey}>{children}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="preview-animation" data-position={position} data-testid="preview-animation">
          <div key={replayKey}>{children}</div>
        </div>
      )}
    </div>
  )
}

export const PreviewModal = memo(PreviewModalComponent)
