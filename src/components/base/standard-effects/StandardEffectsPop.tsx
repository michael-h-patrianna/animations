import type { AnimationMetadata } from '@/types/animation'
import './shared.css'
import './StandardEffectsPop.css'

export function StandardEffectsPop() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element pop-element">
        <div className="demo-text">Pop</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__pop',
  title: 'Pop',
  description: 'Scale overshoot entrance with rotation twist and motion blur for emphasis.',
  tags: ['css'],
}
