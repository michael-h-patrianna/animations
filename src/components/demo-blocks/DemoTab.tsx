import type { CSSProperties } from 'react'
import './demo-blocks.css'

interface DemoTabProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

/** Single tab button with active state visual. */
export function DemoTab({ label, active = false, onClick, className = '', style }: DemoTabProps) {
  return (
    <div
      className={`pf-demo-tab${active ? ' pf-demo-tab--active' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {label}
    </div>
  )
}
