import { memo } from 'react'
import '../shared.css'
import './StandardEffectsShake.css'

function StandardEffectsShakeComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element shake-element">
        <div className="demo-text">Shake</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsShake to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsShake = memo(StandardEffectsShakeComponent)

