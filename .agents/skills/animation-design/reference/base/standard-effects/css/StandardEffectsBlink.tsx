import { memo } from 'react'
import '../shared.css'
import './StandardEffectsBlink.css'

function StandardEffectsBlinkComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element blink-element">
        <div className="demo-text">Blink</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsBlink to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsBlink = memo(StandardEffectsBlinkComponent)

