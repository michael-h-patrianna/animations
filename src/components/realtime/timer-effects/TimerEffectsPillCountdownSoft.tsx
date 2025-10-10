import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './TimerEffectsPillCountdownSoft.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'timer-effects__pill-countdown-soft',
  title: 'Pill Countdown — Soft',
  description: 'Quiet thresholds: mostly static. Brief pulse only at 60s, 30s, 10s and last 5s.',
  tags: ['framer'],
}

// Quiet thresholds: mostly static. Brief pulse only at 60s, 30s, 10s and last 5s.
export function TimerEffectsPillCountdownSoft() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [pulseKey, setPulseKey] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const startTime = Date.now()
    let lastDisplay = START_SECONDS

    const shouldPulse = (display: number) => {
      // Pulse every 10 seconds from 60..10, and each of the last 5 seconds
      if (display > 0 && display <= 60 && display >= 10 && display % 10 === 0) return true
      if (display <= 5 && display > 0) return true
      return false
    }

    const intervalId = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(0, START_SECONDS - elapsed)
      const display = Math.max(0, Math.ceil(remaining))

      if (display !== lastDisplay) {
        setSeconds(display)

        if (shouldPulse(display) && !shouldReduceMotion) {
          setPulseKey((prev) => prev + 1)
        }

        lastDisplay = display
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
      }
    }, 100)

    // Trigger initial pulse
    if (!shouldReduceMotion) {
      setPulseKey((prev) => prev + 1)
    }

    return () => clearInterval(intervalId)
  }, [shouldReduceMotion])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const pulseVariants = {
    idle: { scale: 1, opacity: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.9, 1],
      transition: { duration: 0.24, ease: 'easeOut' },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-soft">
        <div className="pf-pill-timer__pill pf-pill-timer__pill--soft">
          <div className="pf-pill-timer__time">{format(seconds)}</div>
        </div>
        <span className="pf-pill-timer__label">Pill Countdown — Soft</span>
      </div>
    )
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-soft">
      <motion.div
        key={pulseKey}
        className="pf-pill-timer__pill pf-pill-timer__pill--soft"
        variants={pulseVariants}
        initial="idle"
        animate="pulse"
      >
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </motion.div>
      <span className="pf-pill-timer__label">Pill Countdown — Soft</span>
    </div>
  )
}
