import { memo } from 'react'
import '../shared.css'
import './StandardEffectsBounce.css'

function StandardEffectsBounceComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__bounce">
      <div className="standard-demo-element bounce-element">
        <div className="demo-text">Bounce</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsBounce to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)

