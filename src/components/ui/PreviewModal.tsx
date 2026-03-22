import { CloseIcon } from '@/components/ui/icons/CloseIcon'
import { MonitorIcon } from '@/components/ui/icons/MonitorIcon'
import { SmartphoneIcon } from '@/components/ui/icons/SmartphoneIcon'
import { useEscapeClose, useFocusTrap } from '@/hooks/useModalAccessibility'
import type { PreviewPosition } from '@/types/animation'
import { memo, useCallback, useRef, type ReactNode } from 'react'
import type { PreviewMode } from './usePreviewModal'
import './PreviewModal.css'

interface PreviewModalProps {
  mode: PreviewMode
  replayKey: number
  previewPosition: PreviewPosition
  /** When true, renders an opaque black background instead of semi-transparent overlay. */
  opaque?: boolean
  /** Max width (px) for preview animation container. */
  previewMaxWidth?: number
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

/**
 * Full-screen preview modal for animations.
 *
 * Click-to-replay: clicking empty space replays the animation. This is
 * implemented via `e.target === e.currentTarget` on each container layer,
 * so clicks on interactive animation content (buttons, links, tabs) are
 * never intercepted — only clicks that land directly on a container's own
 * background trigger replay. Close is via X button or Escape only.
 */
function PreviewModalComponent({
  mode,
  replayKey,
  previewPosition,
  opaque = false,
  previewMaxWidth,
  onClose,
  onReplay,
  onSwitchMode,
  children,
}: PreviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(overlayRef, closeButtonRef)
  useEscapeClose(onClose)

  // Each layer handles its own background clicks via e.target === e.currentTarget.
  // This is safe for ALL animations: interactive children are never the currentTarget.
  const replayOnSelf = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onReplay()
    },
    [onReplay]
  )

  const position = previewPosition
  const previewStyle = previewMaxWidth !== undefined
    ? { '--pf-preview-max-width': `${previewMaxWidth}px` } as React.CSSProperties
    : undefined

  return (
    <div
      className={`preview-overlay${opaque ? ' preview-overlay--opaque' : ''}`}
      ref={overlayRef}
      onClick={replayOnSelf}
      role="dialog"
      aria-modal="true"
      aria-label={`${mode === 'desktop' ? 'Desktop' : 'Mobile'} animation preview`}
      data-testid={`preview-${mode}`}
    >
      <ModeSwitch mode={mode} onSwitchMode={onSwitchMode} />
      <Toolbar onReplay={onReplay} onClose={onClose} closeButtonRef={closeButtonRef} />

      {mode === 'mobile' ? (
        <div className="preview-mobile-frame" onClick={replayOnSelf} data-testid="preview-mobile-frame">
          <div className="preview-mobile-screen" onClick={replayOnSelf}>
            <div
              className="preview-animation"
              data-position={position}
              style={previewStyle}
              data-testid="preview-animation"
            >
              <div key={replayKey}>{children}</div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="preview-animation"
          data-position={position}
          style={previewStyle}
          data-testid="preview-animation"
        >
          <div key={replayKey}>{children}</div>
        </div>
      )}
    </div>
  )
}

export const PreviewModal = memo(PreviewModalComponent)
