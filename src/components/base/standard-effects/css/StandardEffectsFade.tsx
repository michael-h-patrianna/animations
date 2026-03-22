/**
 * Catalog display for the Fade CSS effect.
 * Consumer product: StandardEffectsFade.css — apply .pf-fade to any element.
 */
import { memo } from 'react'
import './StandardEffectsFade.css'

function StandardEffectsFadeComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__fade">
      <div className="pf-fade pf-standard-demo__element">
        <span className="pf-standard-demo__label">Fade</span>
      </div>
    </div>
  )
}

export const StandardEffectsFade = memo(StandardEffectsFadeComponent)
