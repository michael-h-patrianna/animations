import type { CSSProperties, ReactNode } from 'react'
import './demo-blocks.css'

interface DemoGridProps {
  children?: ReactNode
  columns?: number
  className?: string
  style?: CSSProperties
}

/** Responsive card grid container. */
export function DemoGrid({ children, columns, className = '', style }: DemoGridProps) {
  const gridStyle: CSSProperties = {
    ...style,
    ...(columns !== undefined ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {}),
  }
  return (
    <div className={`pf-demo-grid ${className}`} style={gridStyle}>
      {children}
    </div>
  )
}
