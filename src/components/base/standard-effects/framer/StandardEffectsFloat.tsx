import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'

function StandardEffectsFloatComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__float">
      <m.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center 20%' }}
        animate={{
          y: [0, -14, 0],
          x: [0, 5.5, 0, -5.5, 0],
          rotate: [0, -4, 0, 4, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          ease: easeInOut,
        }}
      >
        <div className="demo-text">Float</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsFloat to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsFloat = memo(StandardEffectsFloatComponent)

