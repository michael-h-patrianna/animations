import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicStarBurst.css'

export function RewardBasicStarBurst() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__star-burst">
      <div className="pf-reward-basic__icon">✶</div>
      <span className="pf-reward-basic__label">Star Burst</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__star-burst',
  title: 'Star Burst',
  description: 'Reward flourish: star burst.',
  tags: ['css'],
}
