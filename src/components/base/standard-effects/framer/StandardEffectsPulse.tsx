import { motionDurations, motionEasings } from '@/motion/tokens'
import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import '../shared.css'
import './StandardEffectsPulse.css'

export function StandardEffectsPulse() {
const keyframeTimes = [0, 0.5, 1]

  // Provide a static fallback when users request reduced motion preferences.
  const elementAnimation = {
        scale: [1, 1.25, 1],
        opacity: [1, 0.8, 1],
        transition: {
          duration: motionDurations.pulse,
          ease: motionEasings.standard,
          times: keyframeTimes,
        },
      }
  const glowAnimation = {
        scale: [0.8, 1.5, 2],
        opacity: [0, 0.6, 0],
        transition: {
          duration: motionDurations.pulse,
          ease: motionEasings.standard,
          times: keyframeTimes,
        },
      }

  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element pulse-element"
        initial={{ scale: 1, opacity: 1 }}
        animate={elementAnimation}
      >
        <motion.span
          className="pulse-element__glow"
          aria-hidden="true"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={glowAnimation}
        />
        <div className="demo-text">Pulse</div>
      </motion.div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'standard-effects__pulse',
  title: 'Pulse',
  description: 'Scale pulse with opacity fade and expanding glow for heartbeat effect.',
  tags: ['framer'],
} satisfies AnimationMetadata
