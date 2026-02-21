import { memo } from 'react'
import '../shared.css'
import './StandardEffectsRadialPulse.css'

function StandardEffectsRadialPulseComponent() {
  return (

        <div className="standard-radial-pulse" data-animation-id="standard-effects__radial-pulse" role="img" aria-label="Radial pulse">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`ring ring-${i + 1}`} />
          ))}
          <span className="dot-center" />
        </div>

  )
}

/**
 * Memoized StandardEffectsRadialPulse to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsRadialPulse = memo(StandardEffectsRadialPulseComponent)

