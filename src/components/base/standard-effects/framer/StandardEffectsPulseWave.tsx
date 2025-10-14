import { memo } from 'react'
import { motionDurations, motionEasings } from '@/motion/tokens'
import { motion } from 'framer-motion'
import '../shared.css'
import './StandardEffectsPulseWave.css'

function StandardEffectsPulseWaveComponent() {
  const duration = motionDurations.pulseWave
  const ringTimes = [0, 0.7, 1]

  // Honor reduced-motion preferences with a calm static state.
  const coreAnimation = {
        scale: [1, 1.08, 1],
        transition: { duration, ease: motionEasings.standard, times: [0, 0.5, 1] },
      }

  const ringAnimation =
   {
        scale: [1, 2.8, 2.8],
        opacity: [0.6, 0, 0],
        transition: { duration, ease: motionEasings.standard, times: ringTimes },
      }

  const delayedRingAnimation = {
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

/**
 * Memoized StandardEffectsPulseWave to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsPulseWave = memo(StandardEffectsPulseWaveComponent)

