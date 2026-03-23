import type { ReactNode } from 'react'
import './demo-blocks.css'

interface DemoStepIndicatorProps {
  children?: ReactNode
  className?: string
}

/** Horizontal wizard step indicator row. */
export function DemoStepIndicator({ children, className = '' }: DemoStepIndicatorProps) {
  return <div className={`pf-demo-step-indicator ${className}`}>{children}</div>
}
