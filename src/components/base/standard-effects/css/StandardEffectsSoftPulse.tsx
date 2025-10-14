import { memo } from 'react'
import './StandardEffectsSoftPulse.css'

function StandardEffectsSoftPulseComponent() {
  return (
    <div className="soft-pulse-wrapper">
      <div className="soft-pulse" role="img" aria-label="Soft pulse circle" />
    </div>
  )
}

/**
 * Memoized StandardEffectsSoftPulse to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSoftPulse = memo(StandardEffectsSoftPulseComponent)

