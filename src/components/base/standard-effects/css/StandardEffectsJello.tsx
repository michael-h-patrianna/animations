/**
 * Catalog display for the Jello CSS effect.
 * Consumer product: StandardEffectsJello.css — apply .pf-jello to any element.
 */
import { memo } from 'react'
import './StandardEffectsJello.css'

function StandardEffectsJelloComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__jello">
      <div className="pf-jello pf-standard-demo__element">
        <span className="pf-standard-demo__label">Jello</span>
      </div>
    </div>
  )
}

export const StandardEffectsJello = memo(StandardEffectsJelloComponent)
