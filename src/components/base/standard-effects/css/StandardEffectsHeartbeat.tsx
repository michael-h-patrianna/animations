/**
 * Catalog display for the Heartbeat CSS effect.
 * Consumer product: StandardEffectsHeartbeat.css — apply .pf-heartbeat to any element.
 */
import { memo } from 'react'
import './StandardEffectsHeartbeat.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsHeartbeatComponent() {
  return (
    <DemoBox
      className="pf-heartbeat"
      label="HeartBeat"
      data-animation-id="standard-effects__heartbeat"
    />
  )
}

export const StandardEffectsHeartbeat = memo(StandardEffectsHeartbeatComponent)
