import type { CSSProperties, ReactNode } from 'react'
import { DemoModalBody } from './DemoModalBody'
import { DemoModalFooter } from './DemoModalFooter'
import { DemoModalHeader } from './DemoModalHeader'
import './demo-blocks.css'

interface DemoModalProps {
  title?: string
  badge?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
  style?: CSSProperties
}

/** Composite modal shell assembling header, body, and footer blocks. */
export function DemoModal({
  title = 'New Creator Quest',
  badge = 'Modal',
  children,
  footer,
  className = '',
  style,
}: DemoModalProps) {
  return (
    <div className={`pf-demo-modal ${className}`} style={style}>
      <DemoModalHeader title={title} badge={badge} />
      <DemoModalBody>
        {children ?? <p>Complete 3 live sessions to unlock rewards.</p>}
      </DemoModalBody>
      {footer != null && <DemoModalFooter>{footer}</DemoModalFooter>}
    </div>
  )
}
