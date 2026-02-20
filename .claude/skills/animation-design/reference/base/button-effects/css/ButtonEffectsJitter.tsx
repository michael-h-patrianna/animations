import { memo } from 'react'
import '../shared.css'
import './ButtonEffectsJitter.css'

/**
 * CSS-driven jitter animation that triggers on idle.
 *
 * @returns Button with jitter animation
 */
function ButtonEffectsJitterComponent() {
  return (
    <div className="button-demo" data-animation-id="button-effects__jitter">
      <button className="pf-btn pf-btn--primary bfx-jitter">Click Me!</button>
    </div>
  )
}

export const ButtonEffectsJitter = memo(ButtonEffectsJitterComponent)

