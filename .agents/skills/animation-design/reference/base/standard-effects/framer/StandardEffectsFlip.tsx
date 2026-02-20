import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import '../shared.css'
import './StandardEffectsFlip.css'

function StandardEffectsFlipComponent() {
const flipVariants = {
    animate: {
      rotateY: [0, 90, 180],
      scale: [1, 0.95, 1],
      transition: {
        duration: 0.8,
        ease: easeInOut,
        times: [0, 0.4, 1],
      },
    },
  }
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element flip-element"
        variants={flipVariants}
        animate="animate"
        style={{ perspective: 400 }}
      >
        <div className="demo-text">Flip</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsFlip to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsFlip = memo(StandardEffectsFlipComponent)

