import { memo } from 'react'
import '../shared.css'
import './StandardEffectsFlip.css'

function StandardEffectsFlipComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__flip">
      <div className="standard-demo-element flip-element">
        <div className="demo-text">Flip</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsFlip to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsFlip = memo(StandardEffectsFlipComponent)

