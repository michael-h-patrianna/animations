import * as m from 'motion/react-m'
import { useEffect, useRef, useState, memo } from 'react'

const numberPopVariants = {
  idle: { scale: 1, rotate: 0, opacity: 1 },
  pop: {
    scale: [1, 1.2, 0.98, 1.08, 1],
    rotate: [0, 2, -2, 1, 0],
    opacity: [1, 1, 0.92, 1, 1],
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as const,
      times: [0, 0.25, 0.5, 0.75, 1],
    },
  },
}

const counterFloatVariants = {
  hidden: { y: 8, opacity: 0 },
  float: {
    y: [8, -4, -12, -16],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      times: [0, 0.2, 0.5, 1],
    },
  },
}

function TextEffectsCounterIncrementComponent() {
  const [isValueAnimating, setIsValueAnimating] = useState(false)
  const [count, setCount] = useState(0)
  const [floatingId, setFloatingId] = useState<number | null>(null)
  const nextIdRef = useRef(0)

  useEffect(() => {
    let isMounted = true
    const timeoutIds = new Set<ReturnType<typeof setTimeout>>()

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId)
        if (!isMounted) return
        callback()
      }, delayMs)
      timeoutIds.add(timeoutId)
    }

    const animationCycle = () => {
      if (!isMounted) return
      setIsValueAnimating(true)
      setFloatingId(nextIdRef.current++)
      setCount((c) => c + 1)

      scheduleTimeout(() => setIsValueAnimating(false), 500)
      scheduleTimeout(() => setFloatingId(null), 800)
    }

    animationCycle()
    const intervalId = setInterval(animationCycle, 2000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
    }
  }, [])

  return (
    <div className="pf-counter-showcase" data-animation-id="text-effects__counter-increment">
      <div className="pf-counter-showcase__target">
        <m.span
          className="pf-counter-showcase__value"
          variants={numberPopVariants}
          initial="idle"
          animate={isValueAnimating ? 'pop' : 'idle'}
        >
          <span className="pf-counter-showcase__value-glow" aria-hidden="true" />
          <span className="pf-counter-showcase__value-text">{count}</span>
        </m.span>

        {floatingId !== null && (
          <m.span
            key={floatingId}
            className="pf-update-indicator__counter"
            variants={counterFloatVariants}
            initial="hidden"
            animate="float"
          >
            +1
          </m.span>
        )}
      </div>
    </div>
  )
}

export const TextEffectsCounterIncrement = memo(TextEffectsCounterIncrementComponent)
