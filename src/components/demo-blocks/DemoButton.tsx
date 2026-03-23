import type { ButtonHTMLAttributes, CSSProperties } from 'react'
import './demo-blocks.css'

interface DemoButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  label: string
  variant?: 'primary' | 'secondary'
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

/** Themed action button for demo modal footers and forms. */
export function DemoButton({ label, variant = 'primary', className = '', style, onClick, ...rest }: DemoButtonProps) {
  return (
    <button
      type="button"
      className={`pf-demo-btn pf-demo-btn--${variant} ${className}`}
      style={style}
      onClick={onClick}
      {...rest}
    >
      {label}
    </button>
  )
}
