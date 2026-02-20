import { memo } from 'react'
import '../shared.css'
import './StandardEffectsJello.css'

function StandardEffectsJelloComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element jello-element">
        <div className="demo-text">Jello</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsJello to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsJello = memo(StandardEffectsJelloComponent)

