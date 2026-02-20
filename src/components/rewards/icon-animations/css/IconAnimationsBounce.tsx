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
    <div className="icon-demo-container">
      <img src={giftBoxImage} alt="Bouncing gift box" className="icon-bounce-element" />
    </div>
  )
}

