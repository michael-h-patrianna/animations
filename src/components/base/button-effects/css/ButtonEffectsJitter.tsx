import { memo } from 'react'
import './ButtonEffectsJitter.css'
import '../shared.css'

function ButtonEffectsJitterComponent() {
  return (
    <div className="button-demo" data-animation-id="button-effects__jitter">
      <button className="pf-btn pf-btn--primary pf-btn--jitter">Click Me!</button>
    </div>
  )
}

/**
 * Memoized ButtonEffectsJitter to prevent unnecessary re-renders in grid layouts.
 */
export const ButtonEffectsJitter = memo(ButtonEffectsJitterComponent)

