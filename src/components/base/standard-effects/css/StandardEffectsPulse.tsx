/**
 * Catalog display for the Pulse CSS effect.
 * Consumer product: StandardEffectsPulse.css — apply .pf-pulse to any element.
 */
import { memo } from 'react'
import './StandardEffectsPulse.css'

function StandardEffectsPulseComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__pulse">
      <div className="pf-pulse pf-standard-demo__element">
        <span className="pf-standard-demo__label">Pulse</span>
      </div>
    </div>
  )
}

export const StandardEffectsPulse = memo(StandardEffectsPulseComponent)
