/**
 * Catalog display for the Swing CSS effect.
 * Consumer product: StandardEffectsSwing.css — apply .pf-swing to any element.
 */
import { memo } from 'react'
import './StandardEffectsSwing.css'

function StandardEffectsSwingComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__swing">
      <div className="pf-swing pf-standard-demo__element">
        <span className="pf-standard-demo__label">Swing</span>
      </div>
    </div>
  )
}

export const StandardEffectsSwing = memo(StandardEffectsSwingComponent)
