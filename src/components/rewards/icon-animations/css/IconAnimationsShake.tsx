import './IconAnimationsShake.css'

import { shakeIcon } from '@/assets'
export function IconAnimationsShake() {
  return (
    <div className="icon-demo-container" data-animation-id="icon-animations__shake">
      <img src={shakeIcon} alt="Shake animation" className="icon-shake-element" />
    </div>
  )
}
