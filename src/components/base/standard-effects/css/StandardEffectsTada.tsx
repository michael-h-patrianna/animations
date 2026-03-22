/**
 * Catalog display for the Tada CSS effect.
 * Consumer product: StandardEffectsTada.css — apply .pf-tada to any element.
 */
import { memo } from 'react'
import './StandardEffectsTada.css'

function StandardEffectsTadaComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__tada">
      <div className="pf-tada pf-standard-demo__element">
        <span className="pf-standard-demo__label">Tada</span>
      </div>
    </div>
  )
}

export const StandardEffectsTada = memo(StandardEffectsTadaComponent)
