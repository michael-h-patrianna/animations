import type { ReactNode } from 'react'
import './demo-blocks.css'

interface DemoModalFooterProps {
  children?: ReactNode
  className?: string
}

/** Modal footer section with right-aligned actions. */
export function DemoModalFooter({ children, className = '' }: DemoModalFooterProps) {
  return <div className={`pf-demo-modal__footer ${className}`}>{children}</div>
}
