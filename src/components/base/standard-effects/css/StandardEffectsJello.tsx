import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsJello.css'

export function StandardEffectsJello() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element jello-element">
        <div className="demo-text">Jello</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__jello',
  title: 'Jello',
  description: 'Wobble deformation with ripple-through effect and bounce for gelatinous motion.',
  tags: ['css'],
}
