import { memo } from 'react'
import '../shared.css'
import './StandardEffectsPulse.css'

function StandardEffectsPulseComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element pulse-element">
        <div className="demo-text">Pulse</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsPulse to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsPulse = memo(StandardEffectsPulseComponent)

