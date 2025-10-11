import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsTada.css'

export function StandardEffectsTada() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element tada-element">
        <div className="demo-text">Tada</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__tada',
  title: 'Tada',
  description: 'Celebration animation combining scale and rotation for success moments.',
  tags: ['css'],
}
