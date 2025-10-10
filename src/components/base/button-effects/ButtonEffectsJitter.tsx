import type { AnimationMetadata } from '@/types/animation'
import './ButtonEffectsJitter.css'
import './shared.css'

export function ButtonEffectsJitter() {
  return (
    <div className="button-demo" data-animation-id="button-effects__jitter">
      <button className="pf-btn pf-btn--primary pf-btn--jitter">Click Me!</button>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'button-effects__jitter',
  title: 'Button Jitter',
  description: 'Playful button with continuous jittery animation and heartbeat on hover.',
  tags: ['css'],
}
