import { memo } from 'react'
import '../shared.css'
import './StandardEffectsFloat.css'

function StandardEffectsFloatComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element float-element">
        <div className="demo-text">Float</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsFloat to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsFloat = memo(StandardEffectsFloatComponent)
