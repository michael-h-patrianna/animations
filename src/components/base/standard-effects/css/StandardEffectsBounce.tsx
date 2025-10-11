import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsBounce.css'

export function StandardEffectsBounce() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-bounce-element">
        <div className="demo-text">Bounce</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__bounce',
  title: 'Bounce',
  description: 'Vertical bounce with squash-stretch deformation and tilt for playful feedback.',
  tags: ['css'],
}
