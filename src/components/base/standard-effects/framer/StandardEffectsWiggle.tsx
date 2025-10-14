import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'

import '../shared.css'

function StandardEffectsWiggleComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element"
        animate={{
          rotate: [0, -3, 3, -3, 3, -3, 3, -3, 3, -3, 3, 0],
          scale: [1, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1],
          x: [0, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, 0],
        }}
        transition={{
          duration: 1,
          ease: easeInOut,
        }}
      >
        <div className="demo-text">Wiggle</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsWiggle to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsWiggle = memo(StandardEffectsWiggleComponent)


