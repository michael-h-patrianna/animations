import { memo } from 'react'
import * as m from 'motion/react-m'

function StandardEffectsTadaComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__tada">
      <m.div
        className="standard-demo-element"
        animate={{
          scale: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
          rotate: [0, -3, -3, 3, -3, 3, -3, 3, -3, 3, 0],
          skewX: [0, -2, -2, 1, -1, 1, -1, 1, -1, 1, 0],
          opacity: [1, 0.95, 0.95, 1, 0.98, 1, 0.98, 1, 0.98, 1, 1],
        }}
        transition={{
          duration: 1,
          ease: [0.4, 0, 0.6, 1] as const,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }}
      >
        <div className="demo-text">Tada</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsTada to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsTada = memo(StandardEffectsTadaComponent)

