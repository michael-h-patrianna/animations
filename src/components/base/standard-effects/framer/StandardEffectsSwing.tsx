import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'

function StandardEffectsSwingComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center top' }}
        animate={{
          rotate: [0, 15, -10, 5, -2, 0],
          x: [0, 2, -1.5, 1, -0.5, 0],
        }}
        transition={{
          duration: 1,
          ease: easeInOut,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      >
        <div className="demo-text">Swing</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSwing to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSwing = memo(StandardEffectsSwingComponent)

