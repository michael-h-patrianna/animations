import { memo } from 'react'
import { motionDurations, motionEasings } from '@/motion/tokens'
import * as m from 'motion/react-m'

function StandardEffectsPulseComponent() {
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
      <m.div
        className="standard-demo-element pulse-element"
        initial={{ scale: 1, opacity: 1 }}
        animate={elementAnimation}
      >
        <m.span
          className="pulse-element__glow"
          aria-hidden="true"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={glowAnimation}
        />
        <div className="demo-text">Pulse</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsPulse to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsPulse = memo(StandardEffectsPulseComponent)

