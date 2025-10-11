import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsPulse.css'

export function StandardEffectsPulse() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element pulse-element">
        <div className="demo-text">Pulse</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__pulse',
  title: 'Pulse',
  description: 'Scale pulse with opacity fade and expanding glow for heartbeat effect.',
  tags: ['css'],
}
