import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsWiggle.css'

export function StandardEffectsWiggle() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-wiggle-element">
        <div className="demo-text">Wiggle</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__wiggle',
  title: 'Wiggle',
  description: 'Rotation oscillation with scale breathing and position drift for attention.',
  tags: ['css'],
}
