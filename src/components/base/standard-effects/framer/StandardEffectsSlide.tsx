import { memo } from 'react'
import { easeOut, motion } from 'framer-motion'

import '../shared.css'

function StandardEffectsSlideComponent() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center left' }}
        initial={{ x: '-100%', scale: 0.8, rotate: -5, opacity: 0 }}
        animate={{ x: 0, scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: easeOut,
        }}
      >
        <div className="demo-text">Slide</div>
      </motion.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSlide to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)

