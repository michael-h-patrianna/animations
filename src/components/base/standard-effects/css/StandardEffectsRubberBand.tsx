import { memo } from 'react'
import '../shared.css'
import './StandardEffectsRubberBand.css'

function StandardEffectsRubberBandComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-rubber-band-element">
        <div className="demo-text">RubberBand</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsRubberBand to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsRubberBand = memo(StandardEffectsRubberBandComponent)

