import type { AnimationMetadata } from '@/types/animation'
import './shared.css'
import './StandardEffectsRadialPulse.css'

export function StandardEffectsRadialPulse() {
  return (

        <div className="standard-radial-pulse" role="img" aria-label="Radial pulse">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`ring ring-${i + 1}`} />
          ))}
          <span className="dot-center" />
        </div>

  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__radial-pulse',
  title: 'Radial Pulse',
  description: 'Concentric ripple pulses expanding from the center using CSS transforms and opacity.',
  tags: ['css'],
}
