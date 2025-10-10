import { motionDurations, motionEasings } from '@/motion/tokens'
import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './shared.css'
import './StandardEffectsPulseCircle.css'

export function StandardEffectsPulseCircle() {
  const shouldReduceMotion = useReducedMotion()
  const duration = motionDurations.pulseCircle
  const ringTimes = [0, 0.7, 1]

  // Reduced motion users should see a static representation rather than a looping pulse.
  const coreAnimation = shouldReduceMotion
    ? { scale: 1 }
    : {
        scale: [1, 1.06, 1],
        transition: { duration, ease: motionEasings.standard, times: [0, 0.5, 1] },
      }

  const ringAnimation = shouldReduceMotion
    ? { scale: 1.15, opacity: 0.24 }
    : {
        scale: [1, 2.6, 2.6],
        opacity: [0.7, 0.12, 0],
        transition: { duration, ease: motionEasings.standard, times: ringTimes },
      }

  const delayedRingAnimation = shouldReduceMotion
    ? { scale: 1.25, opacity: 0.18 }
    : {
        scale: [1, 2.6, 2.6],
        opacity: [0.6, 0.1, 0],
        transition: { duration, delay: duration / 2, ease: motionEasings.standard, times: ringTimes },
      }

  return (
    <div className="pulse-circle-wrapper">
      <motion.div
        className="pulse-circle"
        role="img"
        aria-label="Pulse circle"
        initial={{ scale: 1 }}
        animate={coreAnimation}
      >
        <motion.span
          className="pulse-circle__ring"
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={ringAnimation}
        />
        <motion.span
          className="pulse-circle__ring pulse-circle__ring--delayed"
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={delayedRingAnimation}
        />
      </motion.div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'standard-effects__pulse-circle',
  title: 'Pulse Circle',
  description: 'Breathing core with staggered outward ripple rings (no text on the circle).',
  tags: ['framer'],
} satisfies AnimationMetadata
