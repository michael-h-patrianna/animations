import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, easeOut, motion } from 'framer-motion'
import './StandardEffectsMorphPulse.css'

export function StandardEffectsMorphPulse() {
const coreVariants = {
    animate: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 1.6,
        ease: easeInOut,
        times: [0, 0.5, 1],
      },
    },
  }

  const ringVariants = {
    animate: {
      scaleX: [1, 1.6, 2.6],
      scaleY: [1, 1.2, 1.4],
      borderRadius: ['50%', '18px', '22px'],
      opacity: [0.9, 0.45, 0],
      transition: {
        duration: 1.6,
        ease: easeOut,
        times: [0, 0.4, 1],
      },
    },
  }

  const ringDelayedVariants = {
    animate: {
      scaleX: [1, 1.6, 2.6],
      scaleY: [1, 1.2, 1.4],
      borderRadius: ['50%', '18px', '22px'],
      opacity: [0.9, 0.45, 0],
      transition: {
        duration: 1.6,
        ease: easeOut,
        times: [0, 0.4, 1],
        delay: 0.8,
      },
    },
  }
  return (
    <div className="morph-pulse-wrapper">
      <motion.div
        className="morph-pulse"
        role="img"
        aria-label="Morph pulse blob"
        variants={coreVariants}
        animate="animate"
      >
        <motion.span
          className="morph-pulse__ring"
          aria-hidden="true"
          variants={ringVariants}
          animate="animate"
        />
        <motion.span
          className="morph-pulse__ring morph-pulse__ring--delayed"
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
  id: 'standard-effects__morph-pulse',
  title: 'Morph Pulse',
  description: 'Organic pulse that morphs from circle to rounded rectangle while expanding.',
  tags: ['framer'],
} satisfies AnimationMetadata
