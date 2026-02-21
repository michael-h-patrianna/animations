import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useEffect, useState } from 'react'

const START_SECONDS = 60
const TICK_INTERVAL_MS = 100
const FLASH_RESET_DELAY_MS = 220

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

const formatClock = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const resolveExtremeColorClass = (displaySeconds: number) => {
  if (displaySeconds > 30) {
    return ''
  }

  if (displaySeconds > 10) {
    return 'is-warning'
  }

  if (displaySeconds > 0) {
    return 'is-danger'
  }

  return ''
}

const shouldTriggerBuzz = (displaySeconds: number) => {
  if (displaySeconds === 60 || displaySeconds === 50 || displaySeconds === 40) {
    return true
  }

  if (displaySeconds <= 30 && displaySeconds >= 15 && displaySeconds % 5 === 0) {
    return true
  }

  return displaySeconds <= 10 && displaySeconds > 0
}

const useExtremeCountdown = () => {
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [buzzKey, setBuzzKey] = useState(0)
  const [colorClass, setColorClass] = useState('')

  useEffect(() => {
    const startTime = Date.now()
    let lastDisplay = START_SECONDS
    const timeoutIds = new Set<ReturnType<typeof setTimeout>>()

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId)
        callback()
      }, delayMs)
      timeoutIds.add(timeoutId)
    }

    const intervalId = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000
      const remainingSeconds = Math.max(0, START_SECONDS - elapsedSeconds)
      const displaySeconds = Math.max(0, Math.ceil(remainingSeconds))

      if (displaySeconds === lastDisplay) {
        if (remainingSeconds <= 0) {
          clearInterval(intervalId)
        }
        return
      }

      setSeconds(displaySeconds)

      if (displaySeconds === 0) {
        setColorClass('is-flash')
        scheduleTimeout(() => setColorClass(''), FLASH_RESET_DELAY_MS)
      } else {
        setColorClass(resolveExtremeColorClass(displaySeconds))
      }

      if (shouldTriggerBuzz(displaySeconds)) {
        setBuzzKey((previous) => previous + 1)
      }

      lastDisplay = displaySeconds

      if (remainingSeconds <= 0) {
        clearInterval(intervalId)
      }
    }, TICK_INTERVAL_MS)

    setBuzzKey((previous) => previous + 1)

    return () => {
      clearInterval(intervalId)
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutIds.clear()
    }
  }, [])

  return { seconds, buzzKey, colorClass }
}

/**
 *
 */
export function TimerEffectsPillCountdownExtreme() {
  const { seconds, buzzKey, colorClass } = useExtremeCountdown()

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
        <div className="pf-pill-timer__time">{formatClock(seconds)}</div>
      </m.div>
      <span className="pf-pill-timer__label">Pill Countdown — Extreme</span>
    </div>
  )
}
