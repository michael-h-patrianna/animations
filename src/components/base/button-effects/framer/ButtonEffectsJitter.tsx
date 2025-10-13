import { motion } from 'framer-motion'
import { useState } from 'react'
import '../shared.css'
import './ButtonEffectsJitter.css'

export function ButtonEffectsJitter() {
const [isHovered, setIsHovered] = useState(false)

  const jitterVariants = {
    animate: {
      scale: [1, 0.9, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1],
      rotate: [0, 0, 0, -5, 5, -3, 2, 0, 0, 0],
      transition: {
        duration: 4,
        ease: 'linear' as const,
        repeat: Infinity,
        times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 1],
      },
    },
  }

  const heartbeatVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.2,
        ease: 'linear' as const,
        repeat: Infinity,
      },
    },
  }
  return (
    <div className="button-demo" data-animation-id="button-effects__jitter">
      <motion.button
        className="pf-btn pf-btn--primary pf-btn--jitter"
        variants={isHovered ? heartbeatVariants : jitterVariants}
        animate="animate"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        Click Me!
      </motion.button>
    </div>
  )
}
