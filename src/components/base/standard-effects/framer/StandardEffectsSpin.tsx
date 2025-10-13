import { easeOut, motion } from 'framer-motion'

import '../shared.css'

export function StandardEffectsSpin() {
  return (
    <div className="standard-demo-container">
      <motion.div
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
      </motion.div>
    </div>
  )
}

