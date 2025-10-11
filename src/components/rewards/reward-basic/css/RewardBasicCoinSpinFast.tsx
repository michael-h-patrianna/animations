import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicCoinSpinFast.css'

export function RewardBasicCoinSpinFast() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__coin-spin-fast">
      <div className="pf-reward-basic__icon">◎</div>
      <span className="pf-reward-basic__label">Quick Coin Spin</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__coin-spin-fast',
  title: 'Coin Spin Fast',
  description: 'Reward flourish: coin spin fast.',
  tags: ['css'],
}
