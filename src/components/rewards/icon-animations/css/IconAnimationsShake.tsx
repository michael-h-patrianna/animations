// React import not required for JSX in React 17+
import './IconAnimationsShake.css'

/**
 *
 */
import { shakeIcon } from '@/assets'
/**
 *
 */
export function IconAnimationsShake() {
  return (
    <div className="icon-demo-container">
      <img src={shakeIcon} alt="Shake animation" className="icon-shake-element" />
    </div>
  )
}

