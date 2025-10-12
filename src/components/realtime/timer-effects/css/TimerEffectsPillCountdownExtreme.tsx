import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useState } from 'react'
import './shared.css'
import './TimerEffectsPillCountdownExtreme.css'


export function TimerEffectsPillCountdownExtreme() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [colorClass, setColorClass] = useState('')
  const [animationKey, setAnimationKey] = useState(0)

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
        if (display === 60 || display === 50 || display === 40) {
          setAnimationKey((prev) => prev + 1)
        }
        // Every 5s from 30..15
        if (display <= 30 && display >= 15 && display % 5 === 0) {
          setAnimationKey((prev) => prev + 1)
        }
        // Every second under 10
        if (display <= 10 && display > 0) {
          setAnimationKey((prev) => prev + 1)
        }

        // Flash on zero
        if (display === 0) {
          setColorClass('is-flash')
          setTimeout(() => setColorClass(''), 220)
        }

        lastDisplay = display
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
      }
    }, 100)

    // Initial cue at start
    setAnimationKey((prev) => prev + 1)

    return () => clearInterval(intervalId)
  }, [])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-extreme">
      <div
        key={animationKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--extreme ${colorClass}`}
      >
        <span className="pf-pill-timer__glow" aria-hidden="true" />
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </div>
      <span className="pf-pill-timer__label">Pill Countdown — Extreme</span>
    </div>
  )
}

