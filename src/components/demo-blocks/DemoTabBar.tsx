import type { ReactNode } from 'react'
import './demo-blocks.css'

interface DemoTabBarProps {
  children?: ReactNode
  className?: string
}

/** Horizontal tab row container. */
export function DemoTabBar({ children, className = '' }: DemoTabBarProps) {
  return <div className={`pf-demo-tab-bar ${className}`}>{children}</div>
}
