import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'

function StandardEffectsShakeComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__shake">
      <m.div
        className="standard-demo-element"
        animate={{
          x: [0, -10, 10, -8, 8, -6, 6, -4, 4, -2, 0],
          rotate: [0, -1, 1, -0.8, 0.8, -0.6, 0.6, -0.4, 0.4, -0.2, 0],
          scaleX: [1, 0.98, 0.98, 0.99, 0.99, 0.995, 0.995, 1, 1, 1, 1],
        }}
        transition={{
          duration: 0.5,
          ease: easeInOut,
        }}
      >
        <div className="demo-text">Shake</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsShake to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsShake = memo(StandardEffectsShakeComponent)

