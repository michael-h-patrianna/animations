// React import not required for JSX in React 17+
import pulseScroll from '@/assets/pulse_scroll.png'
import type { AnimationMetadata } from '@/types/animation'
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

export const metadata: AnimationMetadata = {
  id: 'icon-animations__pulse',
  title: 'Pulse',
  description: 'Scale pulse with opacity fade and expanding glow for heartbeat effect.',
  tags: ['css'],
}
