import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicStarRadiate.css'

export function RewardBasicStarRadiate() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__star-radiate">
      <div className="pf-reward-basic__icon">✹</div>
      <span className="pf-reward-basic__label">Star Radiate</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__star-radiate',
  title: 'Star Radiate',
  description: 'Reward flourish: star radiate.',
  tags: ['css'],
}
