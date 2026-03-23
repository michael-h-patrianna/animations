import type { CSSProperties, ReactNode } from 'react'
import './demo-blocks.css'

interface DemoListItemProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/** Single row inside a DemoList with optional custom styling. */
export function DemoListItem({ children, className = '', style }: DemoListItemProps) {
  return (
    <div className={`pf-demo-list-item ${className}`} style={style}>
      {children}
    </div>
  )
}
