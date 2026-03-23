import type { CSSProperties } from 'react'
import { DemoBadge } from './DemoBadge'
import './demo-blocks.css'

interface DemoModalHeaderProps {
  title?: string
  badge?: string
  className?: string
  style?: CSSProperties
}

/** Modal header with title and optional badge. */
export function DemoModalHeader({
  title = 'Sequence Control',
  badge = 'Modal',
  className = '',
  style,
}: DemoModalHeaderProps) {
  return (
    <div className={`pf-demo-modal-header ${className}`} style={style}>
      <h4 className="pf-demo-modal-header__title">{title}</h4>
      <DemoBadge label={badge} />
    </div>
  )
}
