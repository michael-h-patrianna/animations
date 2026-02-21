import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useEffect, useState } from 'react'

const START_SECONDS = 60
const TICK_INTERVAL_MS = 100
const DOUBLE_TAP_DELAY_MS = 160
const PRIMARY_SNAP_SECONDS = new Set([55, 50, 45, 40, 35, 30, 25, 20])
const SECONDARY_SNAP_SECONDS = new Set([15, 12])
const DOUBLE_TAP_SNAP_SECONDS = new Set([9, 7, 5, 3, 1])

const snapVariants = {
  idle: { scale: 1, y: 0 },
  snap: {
    scale: [1, 0.95, 1.03, 1],
    y: [0, 2, -1, 0],
    transition: { duration: 0.16, ease: easeOut },
  },
}

const glowVariants = {
  idle: { scale: 0.92, opacity: 0 },
  snap: {
    scale: [0.92, 0.88, 1.06, 0.92],
    opacity: [0, 0.5, 0.7, 0],
    transition: { duration: 0.16, ease: easeOut },
  },
}

const formatClock = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const resolveStrongColorClass = (displaySeconds: number, previousClass: string) => {
  if (displaySeconds === 30) {
    return 'is-caution'
  }

  if (displaySeconds <= 10 && displaySeconds > 0) {
    return 'is-danger'
  }

  return previousClass
}

const getSnapBursts = (displaySeconds: number) => {
  if (PRIMARY_SNAP_SECONDS.has(displaySeconds) || SECONDARY_SNAP_SECONDS.has(displaySeconds)) {
    return 1
  }

  if (DOUBLE_TAP_SNAP_SECONDS.has(displaySeconds)) {
    return 2
  }

  return 0
}

const useStrongCountdown = () => {
  const [seconds, setSeconds] = useState(START_SECONDS)
  const [snapKey, setSnapKey] = useState(0)
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
      setColorClass((previousClass) => resolveStrongColorClass(displaySeconds, previousClass))

      const burstCount = getSnapBursts(displaySeconds)
      if (burstCount > 0) {
        setSnapKey((previous) => previous + 1)

        if (burstCount === 2) {
          scheduleTimeout(() => setSnapKey((previous) => previous + 1), DOUBLE_TAP_DELAY_MS)
        }
      }

      lastDisplay = displaySeconds

      if (remainingSeconds <= 0) {
        clearInterval(intervalId)
      }
    }, TICK_INTERVAL_MS)

    setSnapKey((previous) => previous + 1)

    return () => {
      clearInterval(intervalId)
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutIds.clear()
    }
  }, [])

  return { seconds, snapKey, colorClass }
}

/**
 *
 */
export function TimerEffectsPillCountdownStrong() {
  const { seconds, snapKey, colorClass } = useStrongCountdown()

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-strong">
      <m.div
        key={snapKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--strong ${colorClass}`}
        variants={snapVariants}
        initial="idle"
        animate="snap"
      >
        <m.span
          className="pf-pill-timer__glow"
          aria-hidden="true"
          variants={glowVariants}
          initial="idle"
          animate="snap"
        />
        <div className="pf-pill-timer__time">{formatClock(seconds)}</div>
      </m.div>
      <span className="pf-pill-timer__label">Pill Countdown — Strong</span>
    </div>
  )
}
