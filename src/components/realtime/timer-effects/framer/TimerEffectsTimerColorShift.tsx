import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './TimerEffectsTimerColorShift.css'

export function TimerEffectsTimerColorShift() {
  const [value, setValue] = useState(10)
  const [timerColor, setTimerColor] = useState('#c6ff77')
  const [arcProgress, setArcProgress] = useState(0)
useEffect(() => {
    const duration = 3000
    const startTime = Date.now()

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)))

      setValue(currentValue)
      setArcProgress(progress)

      // Update color shift: #c6ff77 → #ffb300 → #fa114f
      let color: string
      if (progress < 0.5) {
        // First half: #c6ff77 to #ffb300
        const t = progress * 2
        color = `hsl(${79 - t * 36}, ${100 - t * 14}%, ${66 - t * 16}%)`
      } else {
        // Second half: #ffb300 to #fa114f
        const t = (progress - 0.5) * 2
        color = `hsl(${43 - t * 35}, ${86 + t * 14}%, ${50 - t * 15}%)`
      }
      setTimerColor(color)

      if (progress >= 1) {
        clearInterval(intervalId)
        // Auto-restart after a brief pause
        setTimeout(() => {
          setValue(10)
          setTimerColor('#c6ff77')
          setArcProgress(0)
        }, 1000)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      className="pf-timer"
      data-animation-id="timer-effects__timer-color-shift"
      style={{ '--timer-color': timerColor } as React.CSSProperties}
    >
      <div className="pf-timer__value-wrap">
        <div className="pf-timer__value">{value}</div>
        <div className="pf-timer__arc">
          <svg viewBox="0 0 36 36">
            <motion.path
              className="pf-timer__path"
              d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 0 1 0-31"
              initial={{ strokeDashoffset: 0 }}
              animate={{
                strokeDashoffset: 98 * arcProgress,
              }}
              transition={{ duration: 0.1, ease: 'linear' as const }}
            />
          </svg>
        </div>
      </div>
      <span className="pf-timer__label">Seconds left</span>
      <motion.div
        className="pf-timer__underline"
        animate={{
          scaleX: 1 - arcProgress,
        }}
        transition={{ duration: 0.1, ease: 'linear' as const }}
        style={{ transformOrigin: 'left center' }}
      />
    </div>
  )
}
