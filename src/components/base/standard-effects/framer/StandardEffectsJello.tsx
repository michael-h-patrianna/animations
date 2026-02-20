import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'

function StandardEffectsJelloComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element"
        animate={{
          skewX: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0],
          skewY: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0],
          scale: [1, 1.05, 0.98, 1.02, 0.99, 1.01, 1],
        }}
        transition={{
          duration: 1,
          ease: easeInOut,
          times: [0, 0.3, 0.4, 0.5, 0.65, 0.75, 1],
        }}
      >
        <div className="demo-text">Jello</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsJello to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsJello = memo(StandardEffectsJelloComponent)
