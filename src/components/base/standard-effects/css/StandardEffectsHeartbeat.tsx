/**
 * Catalog display for the Heartbeat CSS effect.
 * Consumer product: StandardEffectsHeartbeat.css — apply .pf-heartbeat to any element.
 */
import { memo } from 'react'
import './StandardEffectsHeartbeat.css'

function StandardEffectsHeartbeatComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__heartbeat">
      <div className="pf-heartbeat pf-standard-demo__element">
        <span className="pf-standard-demo__label">HeartBeat</span>
      </div>
    </div>
  )
}

export const StandardEffectsHeartbeat = memo(StandardEffectsHeartbeatComponent)
