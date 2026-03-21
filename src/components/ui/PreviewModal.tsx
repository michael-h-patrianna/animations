import { CloseIcon } from '@/components/ui/icons/CloseIcon'
import { MonitorIcon } from '@/components/ui/icons/MonitorIcon'
import { SmartphoneIcon } from '@/components/ui/icons/SmartphoneIcon'
import type { PreviewPosition } from '@/types/animation'
import { memo, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { PreviewMode } from './usePreviewModal'
import './PreviewModal.css'

interface PreviewModalProps {
  mode: PreviewMode
  replayKey: number
  previewPosition: PreviewPosition
  onClose: () => void
  onReplay: () => void
  onSwitchMode: (mode: PreviewMode) => void
  children: ReactNode
}

// ── Hooks ──────────────────────────────────────────────────────────────

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function useFocusTrap(
  overlayRef: React.RefObject<HTMLDivElement | null>,
  closeButtonRef: React.RefObject<HTMLButtonElement | null>
) {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
    closeButtonRef.current?.focus()
    return () => {
      previousFocusRef.current?.focus()
    }
  }, [closeButtonRef])

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusable = Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [overlayRef])
}

function useEscapeClose(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])
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
  onClose,
  onReplay,
  onSwitchMode,
  children,
}: PreviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(overlayRef, closeButtonRef)
  useEscapeClose(onClose)

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose]
  )

  const position = previewPosition

  return (
    <div
      className="preview-overlay"
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
