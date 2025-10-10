import type { AnimationMetadata } from '@/types/animation'
import './shared.css'
import './StandardEffectsPulseWave.css'

export function StandardEffectsPulseWave() {
  return (

        <div className="standard-pulse-wave" role="img" aria-label="Pulse wave">
          <div className="core" />
        </div>

  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__pulse-wave',
  title: 'Pulse Wave',
  description: 'Listening pulse with filled core and expanding ring glow.',
  tags: ['css'],
}
