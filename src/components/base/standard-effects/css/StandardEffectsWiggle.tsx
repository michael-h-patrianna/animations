/**
 * Catalog display for the Wiggle CSS effect.
 * Consumer product: StandardEffectsWiggle.css — apply .pf-wiggle to any element.
 */
import { memo } from 'react'
import './StandardEffectsWiggle.css'

function StandardEffectsWiggleComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__wiggle">
      <div className="pf-wiggle pf-standard-demo__element">
        <span className="pf-standard-demo__label">Wiggle</span>
      </div>
    </div>
  )
}

export const StandardEffectsWiggle = memo(StandardEffectsWiggleComponent)
