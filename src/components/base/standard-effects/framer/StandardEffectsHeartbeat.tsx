import { memo } from 'react'
import * as m from 'motion/react-m'

function StandardEffectsHeartbeatComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element"
        animate={{
          scale: [1, 1.3, 1, 1.3, 1.05, 1, 0.98],
          rotate: [0, -5, 2, 5, -1, 0, 0.5],
          y: [0, -2, 0, -3, -1, 0, 0],
          opacity: [1, 0.9, 0.95, 0.9, 0.97, 1, 1],
        }}
        transition={{
          duration: 1.3,
          ease: [0.4, 0, 0.6, 1] as const,
          times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.85],
        }}
      >
        <div className="demo-text">HeartBeat</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsHeartbeat to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsHeartbeat = memo(StandardEffectsHeartbeatComponent)
