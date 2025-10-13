import pulseScroll from '@/assets/pulse_scroll.png'
import '../shared.css'

import { motion } from 'framer-motion'
import './IconAnimationsPulse.css'

export function IconAnimationsPulse() {
  return (
    <div className="icon-demo-container">
      <motion.div
        className="icon-pulse-element"
        animate={{
          scale: [1, 1.02, 1.05, 1.08, 1.12, 1.15, 1.12, 1.08, 1.05, 1.02, 1],
          rotate: [-2, -1.5, -1, 0, 1, 2, 1, 0, -0.5, -1.5, -2],
          skewY: [0, -0.5, -1, -1.5, -2, -2.5, -2, -1.5, -1, -0.5, 0],
          opacity: [1, 1, 0.98, 0.96, 0.94, 0.92, 0.94, 0.96, 0.98, 1, 1],
        }}
        transition={{
          duration: 2,
          ease: [0.4, 0, 0.6, 1] as const,
          repeat: Infinity,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }}
      >
        <img src={pulseScroll} alt="Pulsing scroll" className="icon-pulse-element__image" />
        <motion.span
          className="icon-pulse-element__glow"
          aria-hidden="true"
          animate={{
            scale: [0.8, 1.5, 2],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 2,
            ease: [0.4, 0, 0.6, 1] as const,
            repeat: Infinity,
            times: [0, 0.5, 1],
          }}
        />
      </motion.div>
    </div>
  )
}

