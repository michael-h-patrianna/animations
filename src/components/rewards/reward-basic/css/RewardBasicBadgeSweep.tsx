import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicBadgeSweep.css'

export function RewardBasicBadgeSweep() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__badge-sweep">
      <div className="pf-reward-basic__icon">★</div>
      <span className="pf-reward-basic__label">Badge Sweep</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__badge-sweep',
  title: 'Badge Sweep',
  description: 'Reward flourish: badge sweep.',
  tags: ['css'],
}
