import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { useEffect, useState } from 'react'

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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  }

  const underlineVariants = {
    full: { scaleX: 1 },
    depleting: (progress: number) => ({
      scaleX: 1 - progress,
      transition: { duration: 0.1, ease: 'linear' as const },
    }),
  }

  const progress = (10 - value) / 10
  return (
    <div className="pf-timer" data-animation-id="timer-effects__timer-pulse">
      <m.div className="pf-timer__value" variants={pulseVariants} animate="pulse">
        {value}
      </m.div>
      <span className="pf-timer__label">Seconds left</span>
      <m.div
        className="pf-timer__underline"
        variants={underlineVariants}
        custom={progress}
        animate="depleting"
        style={{ transformOrigin: 'left center' }}
      />
    </div>
  )
}
