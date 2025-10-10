import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './TimerEffectsPillCountdownStrong.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'timer-effects__pill-countdown-strong',
  title: 'Pill Countdown — Strong',
  description: 'Strong: segmented bar + brief snap ticks under 15s. No continuous looping.',
  tags: ['framer'],
}

// Strong: segmented bar + brief snap ticks under 15s. No continuous looping.
export function TimerEffectsPillCountdownStrong() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [snapKey, setSnapKey] = useState(0)
  const [colorClass, setColorClass] = useState('')
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const startTime = Date.now()
    let lastDisplay = START_SECONDS

    const intervalId = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(0, START_SECONDS - elapsed)
      const display = Math.max(0, Math.ceil(remaining))

      if (display !== lastDisplay) {
        setSeconds(display)

        // Color transitions
        if (display === 30) {
          setColorClass('is-caution')
        } else if (display <= 10 && display > 0) {
          setColorClass('is-danger')
        }

        // Snap animations at specific thresholds
        if (!shouldReduceMotion) {
          if ([55, 50, 45, 40, 35, 30, 25, 20].includes(display)) {
            setSnapKey((prev) => prev + 1)
          } else if ([15, 12].includes(display)) {
            setSnapKey((prev) => prev + 1)
          } else if ([9, 7, 5, 3, 1].includes(display)) {
            // Double-tap for critical seconds
            setSnapKey((prev) => prev + 1)
            setTimeout(() => setSnapKey((prev) => prev + 1), 160)
          }
        }

        lastDisplay = display
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
      }
    }, 100)

    // Initial snap
    if (!shouldReduceMotion) {
      setSnapKey((prev) => prev + 1)
    }

    return () => clearInterval(intervalId)
  }, [shouldReduceMotion])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const snapVariants = {
    idle: { scale: 1, y: 0 },
    snap: {
      scale: [1, 0.95, 1.03, 1],
      y: [0, 2, -1, 0],
      transition: { duration: 0.16, ease: 'easeOut' },
    },
  }

  const glowVariants = {
    idle: { scale: 0.92, opacity: 0 },
    snap: {
      scale: [0.92, 0.88, 1.06, 0.92],
      opacity: [0, 0.5, 0.7, 0],
      transition: { duration: 0.16, ease: 'easeOut' },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-strong">
        <div className={`pf-pill-timer__pill pf-pill-timer__pill--strong ${colorClass}`}>
          <span className="pf-pill-timer__glow" aria-hidden="true" />
          <div className="pf-pill-timer__time">{format(seconds)}</div>
        </div>
        <span className="pf-pill-timer__label">Pill Countdown — Strong</span>
      </div>
    )
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-strong">
      <motion.div
        key={snapKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--strong ${colorClass}`}
        variants={snapVariants}
        initial="idle"
        animate="snap"
      >
        <motion.span
          className="pf-pill-timer__glow"
          aria-hidden="true"
          variants={glowVariants}
          initial="idle"
          animate="snap"
        />
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </motion.div>
      <span className="pf-pill-timer__label">Pill Countdown — Strong</span>
    </div>
  )
}
