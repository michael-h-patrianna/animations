import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicCoinSpinSoft.css'

export function RewardBasicCoinSpinSoft() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__coin-spin-soft">
      <div className="pf-reward-basic__icon">◎</div>
      <span className="pf-reward-basic__label">Soft Coin Spin</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__coin-spin-soft',
  title: 'Coin Spin Soft',
  description: 'Reward flourish: coin spin soft.',
  tags: ['css'],
}
