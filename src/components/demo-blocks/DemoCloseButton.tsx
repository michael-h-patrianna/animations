import type { CSSProperties } from 'react'
import './demo-blocks.css'

interface DemoCloseButtonProps {
  onClick?: () => void
  style?: CSSProperties
  className?: string
}

/** Close button with X icon for demo modals. */
export function DemoCloseButton({ onClick, style, className = '' }: DemoCloseButtonProps) {
  return (
    <button
      type="button"
      className={`pf-demo-close-btn ${className}`}
      onClick={onClick}
      aria-label="Close modal"
      style={style}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}
