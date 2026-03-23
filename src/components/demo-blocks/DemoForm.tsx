import type { ReactNode } from 'react'
import './demo-blocks.css'

interface DemoFormProps {
  children?: ReactNode
  className?: string
}

/** Vertical form field container for demo content. */
export function DemoForm({ children, className = '' }: DemoFormProps) {
  return <div className={`pf-demo-form ${className}`}>{children}</div>
}
