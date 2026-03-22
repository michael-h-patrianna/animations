/**
 * Catalog display for the Squeeze CSS effect.
 * Consumer product: StandardEffectsSqueeze.css — apply .pf-squeeze to any element.
 */
import { memo } from 'react'
import './StandardEffectsSqueeze.css'

function StandardEffectsSqueezeComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__squeeze">
      <div className="pf-squeeze pf-standard-demo__element">
        <span className="pf-standard-demo__label">Squeeze</span>
      </div>
    </div>
  )
}

export const StandardEffectsSqueeze = memo(StandardEffectsSqueezeComponent)
