/**
 * Catalog display for the Bounce CSS effect.
 * Consumer product: StandardEffectsBounce.css — apply .pf-bounce to any element.
 */
import { memo } from 'react'
import './StandardEffectsBounce.css'

function StandardEffectsBounceComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__bounce">
      <div className="pf-bounce pf-standard-demo__element">
        <span className="pf-standard-demo__label">Bounce</span>
      </div>
    </div>
  )
}

export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)
