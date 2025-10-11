// React import not required for JSX in React 17+
import balloonImage from '@/assets/present_box_balloon.png'
import type { AnimationMetadata } from '@/types/animation'
import './IconAnimationsFloat.css'

export function IconAnimationsFloat() {
  return (
    <div className="icon-demo-container">
      <img src={balloonImage} alt="Floating balloon" className="icon-float-element" />
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'icon-animations__float',
  title: 'Float',
  description: 'Gentle Y-axis sine wave with subtle rotation and shadow distance changes.',
  tags: ['css'],
}
