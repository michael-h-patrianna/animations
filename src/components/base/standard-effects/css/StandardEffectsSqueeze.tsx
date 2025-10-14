import { memo } from 'react'
import '../shared.css'
import './StandardEffectsSqueeze.css'

function StandardEffectsSqueezeComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-squeeze-element">
        <div className="demo-text">Squeeze</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSqueeze to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSqueeze = memo(StandardEffectsSqueezeComponent)

