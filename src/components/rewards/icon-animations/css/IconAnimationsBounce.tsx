// React import not required for JSX in React 17+
import giftBoxImage from '@/assets/present_box.png'
import type { AnimationMetadata } from '@/types/animation'
import './IconAnimationsBounce.css'

export function IconAnimationsBounce() {
  return (
    <div className="icon-demo-container">
      <img src={giftBoxImage} alt="Bouncing gift box" className="icon-bounce-element" />
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'icon-animations__bounce',
  title: 'Bounce',
  description: 'Vertical bounce with squash-stretch deformation and tilt for playful feedback.',
  tags: ['css'],
}
