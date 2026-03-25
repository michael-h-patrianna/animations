/**
 * Catalog display for the Heartbeat CSS effect.
 * Consumer product: StandardEffectsHeartbeat.css — apply .pf-heartbeat to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsHeartbeat.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsHeartbeatProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsHeartbeatComponent({
  children,
  duration = 1300,
}: StandardEffectsHeartbeatProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-heartbeat-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-heartbeat" data-animation-id="standard-effects__heartbeat" style={style}>
      {children ?? <DemoBox label="Heartbeat" />}
    </div>
  )
}

export const StandardEffectsHeartbeat = memo(StandardEffectsHeartbeatComponent)
