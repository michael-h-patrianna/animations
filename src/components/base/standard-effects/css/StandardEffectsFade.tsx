import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsFade.css'

export function StandardEffectsFade() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element fade-element css-fade-animation">
        <div className="demo-text">Fade</div>
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'standard-effects__fade',
  title: 'Fade',
  description: 'Simple opacity transition from invisible to visible for smooth appearances.',
  tags: ['css'],
}
