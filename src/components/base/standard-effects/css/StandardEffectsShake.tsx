import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsShake.css'

export function StandardEffectsShake() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-shake-element">
        <div className="demo-text">Shake</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__shake',
  title: 'Shake',
  description: 'Horizontal shake with rotation wobble and scale compression for error feedback.',
  tags: ['css'],
}
