/**
 * Glassmorphic card building block for demo content.
 * Theme-aware via --pf-demo-* tokens (dark/light).
 * Catalog infrastructure only — not copied by consumers.
 */

import type { CSSProperties, ReactNode } from 'react'
import './demo-blocks.css'

interface DemoCardProps {
  children?: ReactNode
  title?: string
  className?: string
  style?: CSSProperties
}

/** Glassmorphic card container for demo content. */
export function DemoCard({ children, title, className = '', style }: DemoCardProps) {
  return (
    <div className={`pf-demo-card ${className}`} style={style}>
      {title != null && <h5 className="pf-demo-card__title">{title}</h5>}
      {children != null ? children : <p className="pf-demo-card__text">Card content</p>}
    </div>
  )
}
