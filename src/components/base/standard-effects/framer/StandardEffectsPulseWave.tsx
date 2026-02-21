import { memo } from 'react'
import { motionDurations, motionEasings } from '@/motion/tokens'
import * as m from 'motion/react-m'

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
    <div className="standard-pulse-wave" data-animation-id="standard-effects__pulse-wave" role="img" aria-label="Pulse wave">
      <m.div className="core" initial={{ scale: 1 }} animate={coreAnimation}>
        <m.span
          className="core__ring"
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={ringAnimation}
        />
        <m.span
          className="core__ring core__ring--delayed"
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.4 }}
          animate={delayedRingAnimation}
        />
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsPulseWave to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsPulseWave = memo(StandardEffectsPulseWaveComponent)

