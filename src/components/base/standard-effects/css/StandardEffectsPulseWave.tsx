import { memo } from 'react'
import '../shared.css'
import './StandardEffectsPulseWave.css'

function StandardEffectsPulseWaveComponent() {
  return (

        <div className="standard-pulse-wave" role="img" aria-label="Pulse wave">
          <div className="core" />
        </div>

  )
}

/**
 * Memoized StandardEffectsPulseWave to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsPulseWave = memo(StandardEffectsPulseWaveComponent)

