import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsSlide.css'

export function StandardEffectsSlide() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element slide-element css-slide-animation">
        <div className="demo-text">Slide</div>
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'standard-effects__slide',
  title: 'Slide',
  description: 'Linear sliding motion from off-screen position for panel entrances.',
  tags: ['css'],
}
