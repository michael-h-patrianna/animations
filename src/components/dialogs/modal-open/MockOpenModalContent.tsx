import type { ReactNode } from 'react'

/**
 * Mock modal content for zero-props catalog demo of modal-open animations.
 * Uses pf-mo-* classes from shared.css — self-contained, no cross-group imports.
 * NOT copied by consumers — exists only for catalog rendering.
 */

const STAGGER_DELAY_MS = 60
const CONTENT_ITEMS = [
  'Daily bonus collected',
  'New achievement unlocked',
  'Leaderboard rank updated',
]

/** Total duration of the content reveal/unreveal transition. */
export const CONTENT_TRANSITION_MS = 300 + STAGGER_DELAY_MS * (CONTENT_ITEMS.length + 1)

/**
 * Demo modal content with built-in stagger reveal.
 * Setting `revealed` to false reverses the transitions (content fades out in reverse).
 * `onClose` is called when the user clicks the X or Close button.
 */
export function MockOpenModalContent({
  revealed,
  onClose,
}: {
  revealed?: boolean
  onClose?: () => void
}) {
  const show = revealed === true

  return (
    <div className="pf-mo-box">
      <button
        type="button"
        className="pf-mo-close-btn"
        onClick={onClose}
        aria-label="Close modal"
        style={{
          opacity: show ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div
        className="pf-mo-header"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <h4 className="pf-mo-title">Bonus Reward</h4>
        <span className="pf-mo-badge">New</span>
      </div>
      <div className="pf-mo-body">
        <div className="pf-mo-list">
          {CONTENT_ITEMS.map((text, i) => (
            <div
              key={text}
              className="pf-mo-list-item"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${STAGGER_DELAY_MS * (i + 1)}ms, transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${STAGGER_DELAY_MS * (i + 1)}ms`,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
      <div className="pf-mo-footer">
        <button
          type="button"
          className="pf-mo-btn-primary"
          onClick={onClose}
          style={{
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.94)',
            transition: `opacity 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${STAGGER_DELAY_MS * (CONTENT_ITEMS.length + 1)}ms, transform 250ms cubic-bezier(0.4, 0, 0.2, 1) ${STAGGER_DELAY_MS * (CONTENT_ITEMS.length + 1)}ms`,
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

/**
 * Wraps children or renders mock content.
 * Used by animation components to provide a visible default when children is omitted.
 */
export function ModalOpenPlaceholder({
  children,
  revealed,
  onClose,
}: {
  children?: ReactNode
  revealed?: boolean
  onClose?: () => void
}) {
  if (children !== undefined) return <>{children}</>
  return <MockOpenModalContent revealed={revealed} onClose={onClose} />
}
