import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import '../shared.css'

function StandardEffectsBlinkComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element"
        animate={{
          opacity: [1, 0.85, 0.5, 0.15, 0, 0.2, 0.6, 0.9, 1, 0.95, 0.7, 0.4, 0.2, 0.35, 0.6, 0.85, 1, 1, 1, 1, 1],
          scale: [1, 0.99, 0.97, 0.96, 0.95, 0.97, 1.02, 1.06, 1.1, 1.08, 1.04, 1.01, 0.98, 0.99, 1.01, 1.03, 1.05, 1.04, 1.02, 1.01, 1],
          x: [0, -0.5, -1, -1.5, -2, -1, 0, 0.5, 1, 1.2, 1.5, 1.8, 2, 1.5, 0.5, -0.5, -1, -0.8, -0.4, -0.2, 0],
        }}
        transition={{
          duration: 1,
          ease: easeInOut,
          times: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1],
        }}
      >
        <div className="demo-text">Blink</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsBlink to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsBlink = memo(StandardEffectsBlinkComponent)
