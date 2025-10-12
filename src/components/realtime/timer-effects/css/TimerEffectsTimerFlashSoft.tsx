import { useEffect, useState } from 'react'
import './TimerEffectsTimerFlashSoft.css'

export function TimerEffectsTimerFlashSoft() {
  const [seconds, setSeconds] = useState(32)
  const [animationKey, setAnimationKey] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)

  useEffect(() => {
    const duration = 32000
    const startTime = Date.now()
    let lastDisplayed = 32
    let lastReminderTime = 0
    const reminderInterval = 10000

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const remainingSeconds = Math.max(0, 32 - elapsed / 1000)
      const displaySeconds = Math.max(0, Math.ceil(remainingSeconds))

      if (displaySeconds !== lastDisplayed) {
        setSeconds(displaySeconds)
        lastDisplayed = displaySeconds
      }

      // Shake animation every 10 seconds
      if (elapsed - lastReminderTime >= reminderInterval) {
        lastReminderTime = elapsed
        setShakeKey((prev) => prev + 1)
      }

      if (progress >= 1) {
        clearInterval(intervalId)
        // Auto-restart after a brief pause
        setTimeout(() => {
          setSeconds(32)
          setAnimationKey((prev) => prev + 1)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [animationKey])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="pf-timer-flash-soft" data-animation-id="timer-effects__timer-flash-soft">
      <div key={shakeKey} className="pf-timer-flash-soft__pill">
        <span className="pf-timer-flash-soft__glow" aria-hidden="true" />
        <div className="pf-timer-flash-soft__time">{formatTime(seconds)}</div>
      </div>
      <span className="pf-timer-flash-soft__label">Flash Expire Soft</span>
    </div>
  )
}

