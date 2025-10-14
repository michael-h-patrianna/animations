import { memo } from 'react'
import '../shared.css'
import './StandardEffectsWiggle.css'

function StandardEffectsWiggleComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-wiggle-element">
        <div className="demo-text">Wiggle</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsWiggle to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsWiggle = memo(StandardEffectsWiggleComponent)

