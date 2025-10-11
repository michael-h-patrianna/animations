import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsPulseCircle.css'

export function StandardEffectsPulseCircle() {
  return (

        <div className="pulse-circle-wrapper">
          <div className="pulse-circle" role="img" aria-label="Pulse circle" />
        </div>

  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__pulse-circle',
  title: 'Pulse Circle',
  description: 'Breathing core with staggered outward ripple rings (no text on the circle).',
  tags: ['css'],
}
