import type { AnimationMetadata } from '@/types/animation'
import './StandardEffectsSoftPulse.css'

export function StandardEffectsSoftPulse() {
  return (
    <div className="soft-pulse-wrapper">
      <div className="soft-pulse" role="img" aria-label="Soft pulse circle" />
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__soft-pulse',
  title: 'Soft Pulse',
  description: 'Gentle breathing pulse with a soft glow aura.',
  tags: ['css'],
}
