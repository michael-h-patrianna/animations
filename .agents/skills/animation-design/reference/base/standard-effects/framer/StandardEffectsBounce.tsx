import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import '../shared.css'

function StandardEffectsBounceComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center bottom' }}
        animate={{
          y: [0, 0, -30, -35, -30, 0, 0],
          scaleY: [1, 0.8, 1.1, 1.05, 1.02, 0.95, 1],
          scaleX: [1, 1.1, 0.95, 0.98, 0.99, 1.02, 1],
          rotate: [0, 0, 2, 1, -1, 0, 0],
        }}
        transition={{
          duration: 0.8,
          ease: easeInOut,
          times: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
        }}
      >
        <div className="demo-text">Bounce</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsBounce to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)

