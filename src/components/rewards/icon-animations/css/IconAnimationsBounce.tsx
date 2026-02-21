// React import not required for JSX in React 17+
import './IconAnimationsBounce.css'

/**
 *
 */
import { presentBox as giftBoxImage } from '@/assets'
/**
 *
 */
export function IconAnimationsBounce() {
  return (
    <div className="icon-demo-container" data-animation-id="icon-animations__bounce">
      <img src={giftBoxImage} alt="Bouncing gift box" className="icon-bounce-element" />
    </div>
  )
}
