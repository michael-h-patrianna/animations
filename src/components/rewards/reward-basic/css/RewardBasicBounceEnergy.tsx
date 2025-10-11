import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicBounceEnergy.css'

export function RewardBasicBounceEnergy() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__bounce-energy">
      <div className="pf-reward-basic__icon">⬤</div>
      <span className="pf-reward-basic__label">Energetic Bounce</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__bounce-energy',
  title: 'Bounce Energy',
  description: 'Reward flourish: energetic bounce.',
  tags: ['css'],
}
