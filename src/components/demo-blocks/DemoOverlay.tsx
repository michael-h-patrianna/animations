import type { ReactNode } from 'react'
import './demo-blocks.css'

interface DemoOverlayProps {
  children?: ReactNode
  className?: string
}

/** Centering container for demo modal/card content. */
export function DemoOverlay({ children, className = '' }: DemoOverlayProps) {
  return <div className={`pf-demo-overlay ${className}`}>{children}</div>
}
