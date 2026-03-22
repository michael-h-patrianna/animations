/**
 * Catalog display for the Pop CSS effect.
 * Consumer product: StandardEffectsPop.css — apply .pf-pop to any element.
 */
import { memo } from 'react'
import './StandardEffectsPop.css'

function StandardEffectsPopComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__pop">
      <div className="pf-pop pf-standard-demo__element">
        <span className="pf-standard-demo__label">Pop</span>
      </div>
    </div>
  )
}

export const StandardEffectsPop = memo(StandardEffectsPopComponent)
