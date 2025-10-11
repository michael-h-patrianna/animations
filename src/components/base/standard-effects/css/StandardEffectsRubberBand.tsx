import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsRubberBand.css'

export function StandardEffectsRubberBand() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-rubber-band-element">
        <div className="demo-text">RubberBand</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__rubber-band',
  title: 'Rubber Band',
  description: 'Elastic stretch with thickness variation and edge vibration for springy motion.',
  tags: ['css'],
}
