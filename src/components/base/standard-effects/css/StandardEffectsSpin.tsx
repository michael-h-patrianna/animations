/**
 * Catalog display for the Spin CSS effect.
 * Consumer product: StandardEffectsSpin.css — apply .pf-spin to any element.
 */
import { memo } from 'react'
import './StandardEffectsSpin.css'

function StandardEffectsSpinComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__spin">
      <div className="pf-spin pf-standard-demo__element">
        <span className="pf-standard-demo__label">Spin</span>
      </div>
    </div>
  )
}

export const StandardEffectsSpin = memo(StandardEffectsSpinComponent)
