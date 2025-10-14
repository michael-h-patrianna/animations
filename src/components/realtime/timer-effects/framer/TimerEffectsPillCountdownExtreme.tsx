import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useEffect, useState } from 'react'
import './TimerEffectsPillCountdownExtreme.css'

// Extreme: quiet until last 10s. Stepwise color; 3-2-1 buzz; flash on zero.
export function TimerEffectsPillCountdownExtreme() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [buzzKey, setBuzzKey] = useState(0)
  const [colorClass, setColorClass] = useState('')
useEffect(() => {
    const startTime = Date.now()
    let lastDisplay = START_SECONDS

    const intervalId = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(0, START_SECONDS - elapsed)
      const display = Math.max(0, Math.ceil(remaining))

      if (display !== lastDisplay) {
        setSeconds(display)

        // Color bands: >30 calm, 30..11 warning, <=10 danger
        if (display > 30) {
          setColorClass('')
        } else if (display > 10) {
          setColorClass('is-warning')
        } else if (display > 0) {
          setColorClass('is-danger')
        }

        // Buzz animations at specific thresholds
  {
          if (display === 60 || display === 50 || display === 40) {
            setBuzzKey((prev) => prev + 1)
          }
          // Every 5s from 30..15
          if (display <= 30 && display >= 15 && display % 5 === 0) {
            setBuzzKey((prev) => prev + 1)
          }
          // Every second under 10
          if (display <= 10 && display > 0) {
            setBuzzKey((prev) => prev + 1)
          }

          // Flash on zero
          if (display === 0) {
            setColorClass('is-flash')
            setTimeout(() => setColorClass(''), 220)
          }
        }

        lastDisplay = display
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
      }
    }, 100)

    // Subtle initial cue at start
  {
      setBuzzKey((prev) => prev + 1)
    }

    return () => clearInterval(intervalId)
  }, [])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const buzzVariants = {
    idle: { scale: 1, x: 0 },
    buzz: {
      scale: [1, 1.02, 0.98, 1.01, 1],
      x: [0, -2, 2, -1, 0],
      transition: { duration: 0.18, ease: easeOut },
    },
  }

  const glowVariants = {
    idle: { scale: 0.9, opacity: 0 },
    buzz: {
      scale: [0.9, 1.08, 0.94, 1.05, 0.9],
      opacity: [0, 0.6, 0.4, 0.5, 0],
      transition: { duration: 0.18, ease: easeOut },
    },
  }
  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-extreme">
      <m.div
        key={buzzKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--extreme ${colorClass}`}
        variants={buzzVariants}
        initial="idle"
        animate="buzz"
      >
        <m.span
          className="pf-pill-timer__glow"
          aria-hidden="true"
          variants={glowVariants}
          initial="idle"
          animate="buzz"
        />
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </m.div>
      <span className="pf-pill-timer__label">Pill Countdown — Extreme</span>
    </div>
  )
}
