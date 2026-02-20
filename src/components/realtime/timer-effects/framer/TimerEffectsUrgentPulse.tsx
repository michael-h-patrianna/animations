import * as m from 'motion/react-m'
import { memo } from 'react'

export const TimerEffectsUrgentPulse = memo(function TimerEffectsUrgentPulse() {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Scale animation values
  const scaleValues = [1, 1.12, 1]
  const scaleValuesReduced = [1, 1.06, 1]

  // Opacity animation values for gradient crossfade
  const opacityValues = [0, 1, 0]
  const opacityValuesReduced = 0.5

  // Animation duration
  const duration = prefersReducedMotion ? 1 : 0.5

  return (
    <div className="timer-urgent-pulse-demo" data-animation-id="timer-effects__urgent-pulse">
      <m.div
        className="timer-urgent-pulse"
        animate={{
          scale: prefersReducedMotion ? scaleValuesReduced : scaleValues,
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Base amber gradient - always visible */}
        <div className="timer-urgent-pulse__gradient-base" />

        {/* Top red gradient - opacity animated */}
        <m.div
          className="timer-urgent-pulse__gradient-top"
          animate={{
            opacity: prefersReducedMotion ? opacityValuesReduced : opacityValues,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Content on top */}
        <span className="timer-urgent-pulse__value">0:05</span>
      </m.div>
      <span className="timer-urgent-pulse__label">Urgent Pulse</span>
    </div>
  )
})
