import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicBounceSoft.css'

export function RewardBasicBounceSoft() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__bounce-soft">
      <div className="pf-reward-basic__icon">⬤</div>
      <span className="pf-reward-basic__label">Soft Bounce</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__bounce-soft',
  title: 'Bounce Soft',
  description: 'Reward flourish: soft bounce.',
  tags: ['css'],
}
