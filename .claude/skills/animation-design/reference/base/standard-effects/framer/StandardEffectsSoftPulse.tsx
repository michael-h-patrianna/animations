import { memo } from 'react'

import * as m from 'motion/react-m'
import { easeInOut, easeOut } from 'motion/react'
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
      <m.div
        className="soft-pulse"
        role="img"
        aria-label="Soft pulse circle"
        variants={coreVariants}
        animate="animate"
      >
        <m.span
          className="soft-pulse__glow"
          aria-hidden="true"
          variants={glowVariants}
          animate="animate"
        />
        <m.span
          className="soft-pulse__ring"
          aria-hidden="true"
          variants={ringVariants}
          animate="animate"
        />
        <m.span
          className="soft-pulse__ring soft-pulse__ring--delayed"
          aria-hidden="true"
          variants={ringDelayedVariants}
          animate="animate"
        />
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSoftPulse to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSoftPulse = memo(StandardEffectsSoftPulseComponent)

