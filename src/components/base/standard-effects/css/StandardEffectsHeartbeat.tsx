import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'
import './StandardEffectsHeartbeat.css'

export function StandardEffectsHeartbeat() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element standard-effects-heartbeat">
        <div className="demo-text">HeartBeat</div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__heartbeat',
  title: 'HeartBeat',
  description: 'Double-pulse rhythm animation for likes and favorite interactions.',
  tags: ['css'],
}
