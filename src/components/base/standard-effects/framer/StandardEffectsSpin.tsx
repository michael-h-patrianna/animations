import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'

function StandardEffectsSpinComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__spin">
      <m.div
        className="standard-demo-element"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [0.98, 1.02, 1.04, 1.02, 1],
        }}
        transition={{
          duration: 0.8,
          ease: easeOut,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        <div className="demo-text">Spin</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSpin to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSpin = memo(StandardEffectsSpinComponent)

