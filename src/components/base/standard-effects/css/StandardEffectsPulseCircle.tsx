/**
 * Catalog display for the Pulse Circle CSS effect.
 * Consumer product: StandardEffectsPulseCircle.css — use documented HTML structure.
 */
import { memo } from 'react'
import './StandardEffectsPulseCircle.css'

function StandardEffectsPulseCircleComponent() {
  return (
    <div className="pf-pulse-circle-wrapper" data-animation-id="standard-effects__pulse-circle">
      <div className="pf-pulse-circle" role="img" aria-label="Pulse circle" />
    </div>
  )
}

export const StandardEffectsPulseCircle = memo(StandardEffectsPulseCircleComponent)
