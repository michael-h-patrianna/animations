/**
 * Catalog display for the Flip CSS effect.
 * Consumer product: StandardEffectsFlip.css — apply .pf-flip to any element.
 */
import { memo } from 'react'
import './StandardEffectsFlip.css'

function StandardEffectsFlipComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__flip">
      <div className="pf-flip pf-standard-demo__element">
        <span className="pf-standard-demo__label">Flip</span>
      </div>
    </div>
  )
}

export const StandardEffectsFlip = memo(StandardEffectsFlipComponent)
