import { memo } from 'react'
import '../shared.css'
import './StandardEffectsSpin.css'

function StandardEffectsSpinComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__spin">
      <div className="standard-demo-element spin-element">
        <div className="demo-text">Spin</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSpin to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSpin = memo(StandardEffectsSpinComponent)

