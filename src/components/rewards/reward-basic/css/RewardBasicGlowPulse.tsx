import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicGlowPulse.css'

export function RewardBasicGlowPulse() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__glow-pulse">
      <div className="pf-reward-basic__icon">◎</div>
      <span className="pf-reward-basic__label">Glow Pulse</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__glow-pulse',
  title: 'Glow Pulse',
  description: 'Reward flourish: glow pulse.',
  tags: ['css'],
}
