import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import './demo-blocks.css'

interface DemoBoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  label?: string
  className?: string
  style?: CSSProperties
}

/** Rounded rectangle with centered label — generic demo element for effects. */
export function DemoBox({ children, label, className = '', style, ...rest }: DemoBoxProps) {
  return (
    <div className={`pf-demo-box ${className}`} style={style} {...rest}>
      {children ?? (label != null && <span className="pf-demo-box__label">{label}</span>)}
    </div>
  )
}
