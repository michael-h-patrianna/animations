import { useEffect, useState } from 'react'
import './TimerEffectsTimerPulse.css'

/**
 *
 */
export function TimerEffectsTimerPulse() {
  const [value, setValue] = useState(10)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const duration = 2000
    const startTime = Date.now()
    let restartTimeoutId: ReturnType<typeof setTimeout> | null = null

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)))

      setValue(currentValue)

      if (progress >= 1) {
        clearInterval(intervalId)
        // Auto-restart after a brief pause
        restartTimeoutId = setTimeout(() => {
          setValue(10)
          setAnimationKey((prev) => prev + 1)
        }, 1000)
      }
    }, 100)

    return () => {
      clearInterval(intervalId)
      if (restartTimeoutId) {
        clearTimeout(restartTimeoutId)
      }
    }
  }, [animationKey])

  const progress = (10 - value) / 10

  return (
    <div className="pf-timer-pulse" data-animation-id="timer-effects__timer-pulse">
      <div className="pf-timer-pulse__value">{value}</div>
      <span className="pf-timer-pulse__label">Seconds left</span>
      <div className="pf-timer-pulse__underline" style={{ '--progress': progress } as React.CSSProperties} />
    </div>
  )
}
