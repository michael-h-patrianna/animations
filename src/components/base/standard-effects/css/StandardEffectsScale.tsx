/**
 * Catalog display for the Scale CSS effect.
 * Consumer product: StandardEffectsScale.css — apply .pf-scale to any element.
 */
import { memo } from 'react'
import './StandardEffectsScale.css'

function StandardEffectsScaleComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__scale">
      <div className="pf-scale pf-standard-demo__element">
        <span className="pf-standard-demo__label">Scale</span>
      </div>
    </div>
  )
}

export const StandardEffectsScale = memo(StandardEffectsScaleComponent)
