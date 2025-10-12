import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useState } from 'react'
import './shared.css'
import './TimerEffectsPillCountdownMedium.css'


export function TimerEffectsPillCountdownMedium() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
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

        // Blip animations at specific thresholds
        if (display > 12) {
          if (display % 6 === 0 && display > 0) {
            setAnimationKey((prev) => prev + 1)
          }
        } else if (display > 0) {
          if (display % 3 === 0) {
            setAnimationKey((prev) => prev + 1)
          }
        }

        lastDisplay = display
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
      }
    }, 100)

    // Immediate emphasis on mount
    setAnimationKey((prev) => prev + 1)

    return () => clearInterval(intervalId)
  }, [])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-medium">
      <div
        key={animationKey}
        className="pf-pill-timer__pill pf-pill-timer__pill--medium"
      >
        <span className="pf-pill-timer__glow" aria-hidden="true" />
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </div>
      <span className="pf-pill-timer__label">Pill Countdown — Medium</span>
    </div>
  )
}

