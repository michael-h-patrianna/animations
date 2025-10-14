import { memo } from 'react'
import { easeInOut, motion } from 'framer-motion'
import '../shared.css'

function StandardEffectsFloatComponent() {
  return (
    <div className="standard-demo-container">
      <motion.div
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
      </motion.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsFloat to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsFloat = memo(StandardEffectsFloatComponent)

