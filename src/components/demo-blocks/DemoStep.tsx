import type { CSSProperties } from 'react'
import './demo-blocks.css'

interface DemoStepProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

/** Single wizard step pill with active state. */
export function DemoStep({ label, active = false, onClick, className = '', style }: DemoStepProps) {
  return (
    <button
      type="button"
      className={`pf-demo-step${active ? ' pf-demo-step--active' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {label}
    </button>
  )
}
