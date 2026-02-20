// React import not required for JSX in React 17+
import './IconAnimationsPulse.css'

/**
 *
 */
import { pulseScroll } from '@/assets'
/**
 *
 */
export function IconAnimationsPulse() {
  return (
    <div className="icon-demo-container">
      <div>
        <img src={pulseScroll} alt="Pulsing scroll" className="icon-pulse-element" />
      </div>
    </div>
  )
}

