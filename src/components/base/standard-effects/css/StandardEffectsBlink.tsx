/**
 * Catalog display for the Blink CSS effect.
 * Consumer product: StandardEffectsBlink.css — apply .pf-blink to any element.
 */
import { memo } from 'react'
import './StandardEffectsBlink.css'

function StandardEffectsBlinkComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__blink">
      <div className="pf-blink pf-standard-demo__element">
        <span className="pf-standard-demo__label">Blink</span>
      </div>
    </div>
  )
}

export const StandardEffectsBlink = memo(StandardEffectsBlinkComponent)
