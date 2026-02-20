import { memo } from 'react'
import { motionDurations, motionEasings } from '@/motion/tokens'
import * as m from 'motion/react-m'

function StandardEffectsPulseCircleComponent() {

  const duration = motionDurations.pulseCircle
  const ringTimes = [0, 0.7, 1]

  // Reduced motion users should see a static representation rather than a looping pulse.
  const coreAnimation ={
        scale: [1, 1.06, 1],
        transition: { duration, ease: motionEasings.standard, times: [0, 0.5, 1] },
      }

  const ringAnimation = {
        scale: [1, 2.6, 2.6],
        opacity: [0.7, 0.12, 0],
        transition: { duration, ease: motionEasings.standard, times: ringTimes },
      }

  const delayedRingAnimation = {
        scale: [1, 2.6, 2.6],
        opacity: [0.6, 0.1, 0],
        transition: { duration, delay: duration / 2, ease: motionEasings.standard, times: ringTimes },
      }

  return (
    <div className="pulse-circle-wrapper">
      <m.div
        className="pulse-circle"
        role="img"
        aria-label="Pulse circle"
        initial={{ scale: 1 }}
        animate={coreAnimation}
      >
        <m.span
          className="pulse-circle__ring"
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={ringAnimation}
        />
        <m.span
          className="pulse-circle__ring pulse-circle__ring--delayed"
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={delayedRingAnimation}
        />
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsPulseCircle to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsPulseCircle = memo(StandardEffectsPulseCircleComponent)

