import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsBlink.css'

export function StandardEffectsBlink() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element blink-element">
        <div className="demo-text">Blink</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__blink',
  title: 'Blink',
  description: 'Rapid opacity flash for attention-grabbing notifications and alerts.',
  tags: ['css'],
}
