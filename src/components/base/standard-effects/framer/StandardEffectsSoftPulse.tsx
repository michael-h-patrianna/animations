import { memo } from 'react'

import { easeInOut, easeOut, motion } from 'framer-motion'
import './StandardEffectsSoftPulse.css'
import '../shared.css'

function StandardEffectsSoftPulseComponent() {
const coreVariants = {
    animate: {
      scale: [1, 1.06, 1],
      transition: {
        duration: 2.4,
        ease: easeInOut,
        times: [0, 0.5, 1],
      },
    },
  }

  const glowVariants = {
    animate: {
      scale: [0.9, 1.35, 1.9],
      opacity: [0, 0.55, 0],
      transition: {
        duration: 2.4,
        ease: easeInOut,
        times: [0, 0.5, 1],
      },
    },
  }

  const ringVariants = {
    animate: {
      scale: [1, 1.8, 2.6],
      opacity: [0.85, 0.14, 0],
      transition: {
        duration: 2.4,
        ease: easeOut,
        times: [0, 0.7, 1],
      },
    },
  }

  const ringDelayedVariants = {
    animate: {
      scale: [1, 1.8, 2.6],
      opacity: [0.85, 0.14, 0],
      transition: {
        duration: 2.4,
        ease: easeOut,
        times: [0, 0.7, 1],
        delay: 1.2,
      },
    },
  }
  return (
    <div className="soft-pulse-wrapper">
      <motion.div
        className="soft-pulse"
        role="img"
        aria-label="Soft pulse circle"
        variants={coreVariants}
        animate="animate"
      >
        <motion.span
          className="soft-pulse__glow"
          aria-hidden="true"
          variants={glowVariants}
          animate="animate"
        />
        <motion.span
          className="soft-pulse__ring"
          aria-hidden="true"
          variants={ringVariants}
          animate="animate"
        />
        <motion.span
          className="soft-pulse__ring soft-pulse__ring--delayed"
          aria-hidden="true"
          variants={ringDelayedVariants}
          animate="animate"
        />
      </motion.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSoftPulse to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSoftPulse = memo(StandardEffectsSoftPulseComponent)

