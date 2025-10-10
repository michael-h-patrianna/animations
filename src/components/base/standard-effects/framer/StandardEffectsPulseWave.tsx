import { motionDurations, motionEasings } from '@/motion/tokens'
import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import '../shared.css'
import './StandardEffectsPulseWave.css'

export function StandardEffectsPulseWave() {
  const shouldReduceMotion = useReducedMotion()
  const duration = motionDurations.pulseWave
  const ringTimes = [0, 0.7, 1]

  // Honor reduced-motion preferences with a calm static state.
  const coreAnimation = shouldReduceMotion
    ? { scale: 1 }
    : {
        scale: [1, 1.08, 1],
        transition: { duration, ease: motionEasings.standard, times: [0, 0.5, 1] },
      }

  const ringAnimation = shouldReduceMotion
    ? { scale: 1.2, opacity: 0.3 }
    : {
        scale: [1, 2.8, 2.8],
        opacity: [0.6, 0, 0],
        transition: { duration, ease: motionEasings.standard, times: ringTimes },
      }

  const delayedRingAnimation = shouldReduceMotion
    ? { scale: 1.3, opacity: 0.2 }
    : {
        scale: [1, 2.8, 2.8],
        opacity: [0.4, 0, 0],
        transition: { duration, delay: duration / 2, ease: motionEasings.standard, times: ringTimes },
      }

  return (
    <div className="standard-pulse-wave" role="img" aria-label="Pulse wave">
      <motion.div className="core" initial={{ scale: 1 }} animate={coreAnimation}>
        <motion.span
          className="core__ring"
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={ringAnimation}
        />
        <motion.span
          className="core__ring core__ring--delayed"
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.4 }}
          animate={delayedRingAnimation}
        />
      </motion.div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'standard-effects__pulse-wave',
  title: 'Pulse Wave',
  description: 'Listening pulse with filled core and expanding ring glow.',
  tags: ['framer'],
} satisfies AnimationMetadata
