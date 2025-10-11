import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsSpin.css'

export function StandardEffectsSpin() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element spin-element">
        <div className="demo-text">Spin</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__spin',
  title: 'Spin',
  description: '360-degree rotation with scale pulse at midpoint and motion blur trail.',
  tags: ['css'],
}
