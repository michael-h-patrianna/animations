import type { ReactNode } from 'react'
import './demo-blocks.css'

interface DemoModalBodyProps {
  children?: ReactNode
  className?: string
}

/** Modal body section. */
export function DemoModalBody({ children, className = '' }: DemoModalBodyProps) {
  return <div className={`pf-demo-modal__body ${className}`}>{children}</div>
}
