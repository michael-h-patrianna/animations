/**
 * Catalog display for the Shake CSS effect.
 * Consumer product: StandardEffectsShake.css — apply .pf-shake to any element.
 */
import { memo } from 'react'
import './StandardEffectsShake.css'

function StandardEffectsShakeComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__shake">
      <div className="pf-shake pf-standard-demo__element">
        <span className="pf-standard-demo__label">Shake</span>
      </div>
    </div>
  )
}

export const StandardEffectsShake = memo(StandardEffectsShakeComponent)
