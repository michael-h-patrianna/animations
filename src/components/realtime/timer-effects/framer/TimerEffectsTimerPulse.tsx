import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './TimerEffectsTimerPulse.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'timer-effects__timer-pulse',
  title: 'Timer Pulse',
  description: 'Timer with continuous pulse animation.',
  tags: ['framer'],
}

export function TimerEffectsTimerPulse() {
  const [value, setValue] = useState(10)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const duration = 2000
    const startTime = Date.now()

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)))

      setValue(currentValue)

      if (progress >= 1) {
        clearInterval(intervalId)
        // Auto-restart after a brief pause
        setTimeout(() => {
          setValue(10)
        }, 1000)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  }

  const underlineVariants = {
    full: { scaleX: 1 },
    depleting: (progress: number) => ({
      scaleX: 1 - progress,
      transition: { duration: 0.1, ease: 'linear' as const },
    }),
  }

  const progress = (10 - value) / 10

  if (shouldReduceMotion) {
    return (
      <div className="pf-timer" data-animation-id="timer-effects__timer-pulse">
        <div className="pf-timer__value">{value}</div>
        <span className="pf-timer__label">Seconds left</span>
        <div
          className="pf-timer__underline"
          style={{ transformOrigin: 'left center', transform: `scaleX(${1 - progress})` }}
        />
      </div>
    )
  }

  return (
    <div className="pf-timer" data-animation-id="timer-effects__timer-pulse">
      <motion.div className="pf-timer__value" variants={pulseVariants} animate="pulse">
        {value}
      </motion.div>
      <span className="pf-timer__label">Seconds left</span>
      <motion.div
        className="pf-timer__underline"
        variants={underlineVariants}
        custom={progress}
        animate="depleting"
        style={{ transformOrigin: 'left center' }}
      />
    </div>
  )
}
