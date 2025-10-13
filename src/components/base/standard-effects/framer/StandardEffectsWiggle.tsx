import { easeInOut, motion } from 'framer-motion'

import '../shared.css'

export function StandardEffectsWiggle() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element"
        animate={{
          rotate: [0, -3, 3, -3, 3, -3, 3, -3, 3, -3, 3, 0],
          scale: [1, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1],
          x: [0, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, 0],
        }}
        transition={{
          duration: 1,
          ease: easeInOut,
        }}
      >
        <div className="demo-text">Wiggle</div>
      </motion.div>
    </div>
  )
}


