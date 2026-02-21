import { useEffect, useState } from 'react'
import './shared.css'
import './TimerEffectsPillCountdownStrong.css'


/**
 *
 */
export function TimerEffectsPillCountdownStrong() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [animationKey, setAnimationKey] = useState(0)
  const [colorClass, setColorClass] = useState('')

  useEffect(() => {
    const startTime = Date.now()
    let lastDisplay = START_SECONDS
    const timeoutIds = new Set<ReturnType<typeof setTimeout>>()

    const scheduleTimeout = (callback: () => void, delay: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId)
        callback()
      }, delay)
      timeoutIds.add(timeoutId)
      return timeoutId
    }

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
        if ([55, 50, 45, 40, 35, 30, 25, 20].includes(display)) {
          setAnimationKey((prev) => prev + 1)
        } else if ([15, 12].includes(display)) {
          setAnimationKey((prev) => prev + 1)
        } else if ([9, 7, 5, 3, 1].includes(display)) {
          // Double-tap for critical seconds
          setAnimationKey((prev) => prev + 1)
          scheduleTimeout(() => setAnimationKey((prev) => prev + 1), 160)
        }

        lastDisplay = display
      }

      if (remaining <= 0) {
        clearInterval(intervalId)
      }
    }, 100)

    // Initial snap
    setAnimationKey((prev) => prev + 1)

    return () => {
      clearInterval(intervalId)
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutIds.clear()
    }
  }, [])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-strong">
      <div
        key={animationKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--strong ${colorClass}`}
      >
        <span className="pf-pill-timer__glow" aria-hidden="true" />
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </div>
      <span className="pf-pill-timer__label">Pill Countdown — Strong</span>
    </div>
  )
}
