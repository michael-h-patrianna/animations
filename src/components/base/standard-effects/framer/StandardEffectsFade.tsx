import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'

function StandardEffectsFadeComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element fade-element"
        initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          ease: easeOut,
        }}
      >
        <div className="demo-text">Fade</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsFade to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsFade = memo(StandardEffectsFadeComponent)
