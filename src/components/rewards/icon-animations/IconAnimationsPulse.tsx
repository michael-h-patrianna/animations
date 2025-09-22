// React import not required for JSX in React 17+
import pulseScroll from '@/assets/pulse_scroll.png'
import './IconAnimationsPulse.css'

export function IconAnimationsPulse() {
  return (
    <div className="icon-demo-container">
      <div>
        <img src={pulseScroll} alt="Pulsing scroll" className="icon-pulse-element" />
      </div>
    </div>
  )
}
