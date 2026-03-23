/**
 * Catalog display for the Reward Ready Pulse CSS effect.
 * Consumer product: ButtonEffectsRewardReadyPulse.css — apply .pf-reward-pulse to any element.
 */
import { memo } from 'react'
import './ButtonEffectsRewardReadyPulse.css'

function ButtonEffectsRewardReadyPulseComponent() {
  return (
    <div
      data-animation-id="button-effects__reward-ready-pulse"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <button type="button" className="pf-btn pf-btn--primary pf-reward-pulse">
        Claim Reward
      </button>
    </div>
  )
}

export const ButtonEffectsRewardReadyPulse = memo(ButtonEffectsRewardReadyPulseComponent)
