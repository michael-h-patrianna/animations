import type { ReactNode } from 'react'
import './demo-blocks.css'

interface DemoListProps {
  children?: ReactNode
  className?: string
}

/** Vertical list wrapper for DemoListItem children. */
export function DemoList({ children, className = '' }: DemoListProps) {
  return <div className={`pf-demo-list ${className}`}>{children}</div>
}
