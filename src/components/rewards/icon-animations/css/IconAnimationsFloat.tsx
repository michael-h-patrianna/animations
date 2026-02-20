// React import not required for JSX in React 17+
import './IconAnimationsFloat.css'

/**
 *
 */
import { presentBoxBalloon as balloonImage } from '@/assets'
/**
 *
 */
export function IconAnimationsFloat() {
  return (
    <div className="icon-demo-container">
      <img src={balloonImage} alt="Floating balloon" className="icon-float-element" />
    </div>
  )
}

