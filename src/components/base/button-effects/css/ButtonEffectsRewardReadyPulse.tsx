/**
 * Catalog display for the Reward Ready Pulse CSS effect.
 * Consumer product: ButtonEffectsRewardReadyPulse.css — apply .pf-reward-pulse to any element.
 */
import { memo } from 'react'
import './ButtonEffectsRewardReadyPulse.css'
import { DemoButton } from '@/components/demo-blocks'

function ButtonEffectsRewardReadyPulseComponent() {
  return (
    <DemoButton
      className="pf-reward-pulse"
      label="Claim Reward"
      data-animation-id="button-effects__reward-ready-pulse"
    />
  )
}

export const ButtonEffectsRewardReadyPulse = memo(ButtonEffectsRewardReadyPulseComponent)
