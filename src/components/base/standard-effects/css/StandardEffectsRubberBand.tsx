/**
 * Catalog display for the Rubber Band CSS effect.
 * Consumer product: StandardEffectsRubberBand.css — apply .pf-rubber-band to any element.
 */
import { memo } from 'react'
import './StandardEffectsRubberBand.css'

function StandardEffectsRubberBandComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__rubber-band">
      <div className="pf-rubber-band pf-standard-demo__element">
        <span className="pf-standard-demo__label">RubberBand</span>
      </div>
    </div>
  )
}

export const StandardEffectsRubberBand = memo(StandardEffectsRubberBandComponent)
