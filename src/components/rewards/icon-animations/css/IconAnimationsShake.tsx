// React import not required for JSX in React 17+
import shakeIcon from '@/assets/shake_icon.png'
import type { AnimationMetadata } from '@/types/animation'
import './IconAnimationsShake.css'

export function IconAnimationsShake() {
  return (
    <div className="icon-demo-container">
      <img src={shakeIcon} alt="Shake animation" className="icon-shake-element" />
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'icon-animations__shake',
  title: 'Shake',
  description: 'Horizontal shake with rotation wobble and scale compression for error feedback.',
  tags: ['css'],
}
