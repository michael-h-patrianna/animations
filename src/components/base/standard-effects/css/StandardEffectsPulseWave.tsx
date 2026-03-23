/**
 * Catalog display for the Pulse Wave CSS effect.
 * Consumer product: StandardEffectsPulseWave.css — use documented HTML structure.
 */
import { memo } from 'react'
import './StandardEffectsPulseWave.css'

function StandardEffectsPulseWaveComponent() {
  return (
    <div
      className="pf-pulse-wave"
      data-animation-id="standard-effects__pulse-wave"
      role="img"
      aria-label="Pulse wave"
    >
      <div className="pf-pulse-wave__core" />
    </div>
  )
}

export const StandardEffectsPulseWave = memo(StandardEffectsPulseWaveComponent)
