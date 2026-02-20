import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 *
 */
export function TimerEffectsTimerFlip() {
  const [value, setValue] = useState(10)
  const [flipKey, setFlipKey] = useState(0)
useEffect(() => {
    const duration = 3000
    const startTime = Date.now()
    let lastValue = 10

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)))

      if (currentValue !== lastValue) {
        setValue(currentValue)
  {
          setFlipKey((prev) => prev + 1)
        }
        lastValue = currentValue
      }

      if (progress >= 1) {
        clearInterval(intervalId)
        // Auto-restart after a brief pause
        setTimeout(() => {
          setValue(10)
          setFlipKey((prev) => prev + 1)
        }, 1000)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  const flipVariants = {
    initial: { rotateX: 0, opacity: 1 },
    flip: {
      rotateX: [-180, -360, 0],
      opacity: [0.6, 1, 1],
      transition: {
        duration: 0.5,
        times: [0, 0.5, 1],
        ease: easeInOut,
      },
    },
  }

  const underlineVariants = {
    full: { scaleX: 1 },
    depleting: {
      scaleX: value / 10,
      transition: { duration: 0.3, ease: 'linear' as const },
    },
  }
  return (
    <div className="pf-timer" data-animation-id="timer-effects__timer-flip">
      <m.div
        key={flipKey}
        className="pf-timer__value"
        variants={flipVariants}
        initial="initial"
        animate="flip"
      >
        {value}
      </m.div>
      <span className="pf-timer__label">Seconds left</span>
      <m.div
        className="pf-timer__underline"
        variants={underlineVariants}
        initial="full"
        animate="depleting"
        style={{ transformOrigin: 'left center' }}
      />
    </div>
  )
}
