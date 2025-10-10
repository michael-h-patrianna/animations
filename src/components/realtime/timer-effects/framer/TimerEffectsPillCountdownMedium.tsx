import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './TimerEffectsPillCountdownMedium.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'timer-effects__pill-countdown-medium',
  title: 'Pill Countdown — Medium',
  description: 'Periodic blip: LED corner blink every 10s; subtle perimeter arc progress.',
  tags: ['framer'],
}

// Periodic blip: LED corner blink every 10s; subtle perimeter arc progress.
export function TimerEffectsPillCountdownMedium() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [blipKey, setBlipKey] = useState(0)
useEffect(() => {
    const startTime = Date.now()
    let lastDisplay = START_SECONDS

    const intervalId = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(0, START_SECONDS - elapsed)
      const display = Math.max(0, Math.ceil(remaining))

      if (display !== lastDisplay) {
        setSeconds(display)

        // Blip animations at specific thresholds
  {
          if (display > 12) {
            if (display % 6 === 0 && display > 0) {
              setBlipKey((prev) => prev + 1)
            }
          } else if (display > 0) {
            if (display % 3 === 0) {
              setBlipKey((prev) => prev + 1)
            }
          }
        }

        lastDisplay = display
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
      }
    }, 100)

    // Immediate emphasis on mount
  {
      setBlipKey((prev) => prev + 1)
    }

    return () => clearInterval(intervalId)
  }, [])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const blipVariants = {
    idle: { scale: 1, opacity: 1 },
    blip: {
      scale: [1, 1.08, 1],
      opacity: [1, 0.85, 1],
      transition: { duration: 0.32, ease: easeOut },
    },
  }

  const glowVariants = {
    idle: { scale: 0.9, opacity: 0 },
    blip: {
      scale: [0.9, 1.15, 0.9],
      opacity: [0, 0.6, 0],
      transition: { duration: 0.32, ease: easeOut },
    },
  }
  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-medium">
      <motion.div
        key={blipKey}
        className="pf-pill-timer__pill pf-pill-timer__pill--medium"
        variants={blipVariants}
        initial="idle"
        animate="blip"
      >
        <motion.span
          className="pf-pill-timer__glow"
          aria-hidden="true"
          variants={glowVariants}
          initial="idle"
          animate="blip"
        />
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </motion.div>
      <span className="pf-pill-timer__label">Pill Countdown — Medium</span>
    </div>
  )
}
