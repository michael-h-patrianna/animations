import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useState } from 'react'
import './shared.css'
import './TimerEffectsPillCountdownSoft.css'


export function TimerEffectsPillCountdownSoft() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [animationKey, setAnimationKey] = useState(0)

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

        if (shouldPulse(display)) {
          setAnimationKey((prev) => prev + 1)
        }

        lastDisplay = display
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
      }
    }, 100)

    // Trigger initial pulse
    setAnimationKey((prev) => prev + 1)

    return () => clearInterval(intervalId)
  }, [])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-soft">
      <div
        key={animationKey}
        className="pf-pill-timer__pill pf-pill-timer__pill--soft"
      >
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </div>
      <span className="pf-pill-timer__label">Pill Countdown — Soft</span>
    </div>
  )
}

