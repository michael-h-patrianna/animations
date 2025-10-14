import { memo } from 'react'
import '../shared.css'
import './StandardEffectsHeartbeat.css'

function StandardEffectsHeartbeatComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-heartbeat">
        <div className="demo-text">HeartBeat</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsHeartbeat to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsHeartbeat = memo(StandardEffectsHeartbeatComponent)

