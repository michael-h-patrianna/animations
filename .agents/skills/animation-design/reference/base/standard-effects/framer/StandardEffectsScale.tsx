import { memo } from 'react'

import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import '../shared.css'

function StandardEffectsScaleComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element scale-element"
        initial={{ scale: 0, rotate: 0, skewY: 0, opacity: 0 }}
        animate={{
          scale: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1.05, 1.08, 1.05, 1.02, 1],
          rotate: [0, -6, -10, -8, -4, 2, 4, 2, -1, -0.5, 0],
          skewY: [0, 0.8, 1.4, 1, 0.5, -0.5, -0.8, -0.4, 0.2, 0.1, 0],
          opacity: [0, 0.15, 0.3, 0.5, 0.65, 0.8, 0.9, 0.95, 0.98, 1, 1],
        }}
        transition={{
          duration: 0.6,
          ease: easeOut,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }}
      >
        <div className="demo-text">Scale</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsScale to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsScale = memo(StandardEffectsScaleComponent)


