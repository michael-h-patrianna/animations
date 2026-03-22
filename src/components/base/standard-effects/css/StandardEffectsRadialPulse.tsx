/**
 * Catalog display for the Radial Pulse CSS effect.
 * Consumer product: StandardEffectsRadialPulse.css — use documented HTML structure.
 */
import { memo } from 'react'
import './StandardEffectsRadialPulse.css'

function StandardEffectsRadialPulseComponent() {
  return (
    <div className="pf-radial-pulse" data-animation-id="standard-effects__radial-pulse" role="img" aria-label="Radial pulse">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`pf-radial-pulse__ring pf-radial-pulse__ring--${i}`} />
      ))}
      <span className="pf-radial-pulse__dot" />
    </div>
  )
}

export const StandardEffectsRadialPulse = memo(StandardEffectsRadialPulseComponent)
