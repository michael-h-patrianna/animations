import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsFlip.css'

export function StandardEffectsFlip() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element flip-element">
        <div className="demo-text">Flip</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__flip',
  title: 'Flip',
  description: 'Y-axis card flip with shadow perspective and scale change during rotation.',
  tags: ['css'],
}
