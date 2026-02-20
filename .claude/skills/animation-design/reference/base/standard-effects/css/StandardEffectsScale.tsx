import { memo } from 'react'
import '../shared.css'
import './StandardEffectsScale.css'

function StandardEffectsScaleComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element scale-element">
        <div className="demo-text">Scale</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsScale to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsScale = memo(StandardEffectsScaleComponent)

