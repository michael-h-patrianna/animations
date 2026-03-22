import type { CSSProperties, ReactNode } from 'react'

import './MockModalContent.css'

/**
 * Default placeholder content rendered when an animation component receives no children.
 * Provides enough visual substance to see the animation working in the catalog.
 * Consumers replace this with their own modal content.
 */
export function MockModalContent() {
  return (
    <div className="pf-mock-modal-root">
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>New Creator Quest</h3>
          <span style={badgeStyle}>Modal</span>
        </div>
        <div style={bodyStyle}>
          <p style={paragraphStyle}>Complete 3 live sessions to unlock rewards.</p>
        </div>
        <div style={footerStyle}>
          <button type="button" style={primaryButtonStyle}>
            Accept
          </button>
          <button type="button" style={secondaryButtonStyle}>
            Later
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Wraps children in the default modal placeholder chrome.
 * Used by animation components to provide a visible default when children is omitted.
 */
export function ModalPlaceholder({ children }: { children?: ReactNode }) {
  if (children !== undefined) return <>{children}</>
  return <MockModalContent />
}

// --- Layout styles: colors defined in MockModalContent.css as CSS custom properties ---

const modalStyle: CSSProperties = {
  width: 'clamp(280px, 80%, 320px)',
  padding: '16px',
  borderRadius: '12px',
  background: 'var(--mock-bg)',
  border: '1px solid var(--mock-border)',
  color: 'var(--mock-color)',
  boxShadow: '0 18px 40px var(--mock-shadow-color), inset 0 0 0 1px var(--mock-border)',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
}

const titleStyle: CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  margin: 0,
}

const badgeStyle: CSSProperties = {
  fontSize: '12px',
  padding: '4px 10px',
  borderRadius: '999px',
  background: 'var(--mock-badge-bg)',
  color: 'var(--mock-badge-color)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const bodyStyle: CSSProperties = {
  margin: '16px 0',
  display: 'grid',
  gap: '8px',
  fontSize: '14px',
  lineHeight: 1.5,
}

const paragraphStyle: CSSProperties = { margin: 0 }

const footerStyle: CSSProperties = {
  display: 'flex',
  gap: '10px',
  marginTop: '20px',
  justifyContent: 'flex-end',
}

const buttonBase: CSSProperties = {
  padding: '6px 12px',
  borderRadius: '50px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
}

const primaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: 'linear-gradient(180deg, var(--mock-btn-primary-bg-1), var(--mock-btn-primary-bg-2))',
  color: 'var(--mock-btn-primary-color)',
  border: '2px solid var(--mock-btn-primary-border)',
  textShadow: '0 1px 1px var(--mock-text-shadow)',
}

const secondaryButtonStyle: CSSProperties = {
  ...buttonBase,
  color: 'var(--mock-btn-secondary-color)',
  border: '2px solid var(--mock-btn-secondary-color)',
  background: 'transparent',
}
