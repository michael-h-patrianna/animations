/**
 * Catalog display for the Float CSS effect.
 * Consumer product: StandardEffectsFloat.css — apply .pf-float to any element.
 */
import { memo } from 'react'
import './StandardEffectsFloat.css'

function StandardEffectsFloatComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__float">
      <div className="pf-float pf-standard-demo__element">
        <span className="pf-standard-demo__label">Float</span>
      </div>
    </div>
  )
}

export const StandardEffectsFloat = memo(StandardEffectsFloatComponent)
