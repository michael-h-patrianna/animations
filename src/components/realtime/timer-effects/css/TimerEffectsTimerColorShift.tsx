import { useEffect, useState } from 'react'
import './TimerEffectsTimerColorShift.css'

/**
 *
 */
export function TimerEffectsTimerColorShift() {
  const [value, setValue] = useState(10)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const duration = 3000
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
          setAnimationKey((prev) => prev + 1)
        }, 1000)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [animationKey])

  return (
    <div
      className="pf-timer-color-shift"
      data-animation-id="timer-effects__timer-color-shift"
    >
      <div className="pf-timer-color-shift__value-wrap">
        <div className="pf-timer-color-shift__value">{value}</div>
        <div className="pf-timer-color-shift__arc">
          <svg viewBox="0 0 36 36" className="pf-timer-color-shift__svg">
            <path
              className="pf-timer-color-shift__path"
              d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 0 1 0-31"
            />
          </svg>
        </div>
      </div>
      <span className="pf-timer-color-shift__label">Seconds left</span>
      <div className="pf-timer-color-shift__underline" />
    </div>
  )
}

