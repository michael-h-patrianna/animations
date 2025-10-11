import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicGlowOrbit.css'

export function RewardBasicGlowOrbit() {
  return (
    <div className="pf-reward-basic" data-animation-id="reward-basic__glow-orbit">
      <div className="pf-reward-basic__icon">◎</div>
      <span className="pf-reward-basic__label">Glow Orbit</span>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'reward-basic__glow-orbit',
  title: 'Glow Orbit',
  description: 'Reward flourish: glow orbit.',
  tags: ['css'],
}
