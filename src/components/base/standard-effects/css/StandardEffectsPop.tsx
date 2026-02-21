import { memo } from 'react'
import '../shared.css'
import './StandardEffectsPop.css'

function StandardEffectsPopComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__pop">
      <div className="standard-demo-element pop-element">
        <div className="demo-text">Pop</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsPop to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsPop = memo(StandardEffectsPopComponent)

