import { memo } from 'react'
import '../shared.css'
import './ButtonEffectsRewardReadyPulse.css'

/**
 * CSS-driven reward ready pulse animation combining scale and vertical bob.
 * Creates a "breathing" effect to indicate an element is ready to claim.
 *
 * GPU-accelerated using transform only (scale + translateY).
 * Respects prefers-reduced-motion media query.
 *
 * @returns Button with reward ready pulse animation
 */
function ButtonEffectsRewardReadyPulseComponent() {
  return (
    <div className="button-demo" data-animation-id="button-effects__reward-ready-pulse">
      <button type="button" className="pf-btn pf-btn--primary bfx-reward-ready-pulse">

        Claim Reward
      </button>
    </div>
  )
}

export const ButtonEffectsRewardReadyPulse = memo(ButtonEffectsRewardReadyPulseComponent)
