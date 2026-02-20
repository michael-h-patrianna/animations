import { memo } from 'react'
import * as m from 'motion/react-m'

function StandardEffectsSqueezeComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element"
        animate={{
          scaleX: [1, 1.1, 1.25, 0.75, 1.15, 0.95, 1.05, 0.98, 1],
          scaleY: [1, 0.9, 0.75, 1.25, 0.85, 1.05, 0.95, 1.02, 1],
          rotate: [0, -2, -4, 3, -1, 1, -0.5, 0.2, 0],
          opacity: [1, 0.95, 0.9, 0.92, 0.96, 0.98, 0.99, 1, 1],
        }}
        transition={{
          duration: 0.9,
          ease: [0.68, -0.55, 0.265, 1.55] as const,
          times: [0, 0.15, 0.3, 0.4, 0.5, 0.65, 0.75, 0.85, 1],
        }}
      >
        <div className="demo-text">Squeeze</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSqueeze to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSqueeze = memo(StandardEffectsSqueezeComponent)
