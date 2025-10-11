import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsSqueeze.css'

export function StandardEffectsSqueeze() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-squeeze-element">
        <div className="demo-text">Squeeze</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__squeeze',
  title: 'Squeeze',
  description: 'Compression effect that squashes element for tactile button feedback.',
  tags: ['css'],
}
