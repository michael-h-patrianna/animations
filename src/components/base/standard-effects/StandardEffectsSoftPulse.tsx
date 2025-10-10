import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './StandardEffectsSoftPulse.css'

export function StandardEffectsSoftPulse() {
  const shouldReduceMotion = useReducedMotion()

  const coreVariants = {
    animate: {
      scale: [1, 1.06, 1],
      transition: {
        duration: 2.4,
        ease: 'easeInOut',
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
        ease: 'easeInOut',
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
        ease: 'easeOut',
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
        ease: 'easeOut',
        times: [0, 0.7, 1],
        delay: 1.2,
      },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div className="soft-pulse-wrapper">
        <div className="soft-pulse" role="img" aria-label="Soft pulse circle">
          <span className="soft-pulse__glow" aria-hidden="true" />
          <span className="soft-pulse__ring" aria-hidden="true" />
          <span className="soft-pulse__ring soft-pulse__ring--delayed" aria-hidden="true" />
        </div>
      </div>
    )
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

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'standard-effects__soft-pulse',
  title: 'Soft Pulse',
  description: 'Gentle breathing pulse with a soft glow aura.',
  tags: ['framer'],
} satisfies AnimationMetadata
