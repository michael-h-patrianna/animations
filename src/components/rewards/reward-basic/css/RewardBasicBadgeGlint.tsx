import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicBadgeGlint.css'

export function RewardBasicBadgeGlint() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__badge-glint">
      <div className="pf-reward-basic__icon">★</div>
      <span className="pf-reward-basic__label">Badge Glint</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__badge-glint',
  title: 'Badge Glint',
  description: 'Reward flourish: badge glint.',
  tags: ['css'],
}
