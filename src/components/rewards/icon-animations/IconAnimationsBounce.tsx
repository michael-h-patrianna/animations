// React import not required for JSX in React 17+
import giftBoxImage from '@/assets/present_box.png'
import './IconAnimationsBounce.css'

export function IconAnimationsBounce() {
  return (
    <div className="icon-demo-container">
      <img src={giftBoxImage} alt="Bouncing gift box" className="icon-bounce-element" />
    </div>
  )
}
