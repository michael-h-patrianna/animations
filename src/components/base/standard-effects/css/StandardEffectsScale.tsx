import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsScale.css'

export function StandardEffectsScale() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-scale-element">
        <div className="demo-text">Scale</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__scale',
  title: 'Scale',
  description: 'Clean scale transformation from small to full size without bounce.',
  tags: ['css'],
}
