/**
 * Standalone: Copy this file + TextEffectsCounterIncrement.css into your app.
 * Runtime deps: react, motion
 * RN: Port pop variants + float variants to Moti useAnimatedStyle.
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

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

interface TextEffectsCounterIncrementProps {
  /** Starting value. @default 0 */
  from?: number
  /** Target value. If omitted, runs in continuous loop mode. */
  to?: number
  /** Text before the number (e.g. "$", "+"). */
  prefix?: string
  /** Text after the number (e.g. " pts", " €"). */
  suffix?: string
  /** Custom number formatting. @default Math.round(n).toLocaleString() */
  formatValue?: (n: number) => string
  /** Continuous mode: amount to increment each cycle. @default 1 */
  incrementValue?: number
  /** Continuous mode: milliseconds between increments. @default 2000 */
  intervalMs?: number
  /** Target mode: number of milestone particles. @default 8 */
  maxParticles?: number
  /** Target mode: total animation duration in ms. @default 3000 */
  durationMs?: number
  /** Base color for number, glow, and particles. Gradient stops are computed. @default '#c6ff77' */
  color?: string
}

const defaultFormat = (n: number): string => Math.round(n).toLocaleString()

interface MilestoneStep {
  value: number
  timing: number
  incrementAmount: number
}

function calculateSteps(range: number, numSteps: number, durationMs: number): MilestoneStep[] {
  if (numSteps <= 0 || range === 0) return []
  const steps: MilestoneStep[] = []
  let cumulative = 0
  const easeIn = (t: number) => t * t * t

  for (let i = 0; i < numSteps; i++) {
    const progress = (i + 1) / numSteps
    const easedProgress = easeIn(progress)
    const targetAtStep = Math.round(range * easedProgress)
    let increment = targetAtStep - cumulative
    if (cumulative + increment > range) increment = range - cumulative
    if (increment <= 0) continue
    cumulative += increment
    steps.push({
      value: cumulative,
      timing: Math.round(durationMs * easedProgress),
      incrementAmount: increment,
    })
  }

  if (cumulative < range && steps.length > 0) {
    const last = steps[steps.length - 1]!
    last.incrementAmount += range - cumulative
    last.value = range
    last.timing = durationMs
  }

  return steps
}

function TextEffectsCounterIncrementComponent({
  from = 0,
  to,
  prefix,
  suffix,
  formatValue = defaultFormat,
  incrementValue = 1,
  intervalMs = 2000,
  maxParticles = 8,
  durationMs = 3000,
  color,
}: TextEffectsCounterIncrementProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isValueAnimating, setIsValueAnimating] = useState(false)
  const [count, setCount] = useState(from)
  const [particles, setParticles] = useState<{ id: number; value: number }[]>([])
  const nextIdRef = useRef(0)
  const formatRef = useRef(formatValue)
  formatRef.current = formatValue

  const isContinuousMode = to === undefined

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id))
  }, [])

  // Continuous mode
  useEffect(() => {
    if (!isContinuousMode) return

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
      const id = nextIdRef.current++
      setParticles((prev) => [...prev, { id, value: incrementValue }])
      setCount((c) => c + incrementValue)

      scheduleTimeout(() => setIsValueAnimating(false), 500)
    }

    setCount(from)
    animationCycle()
    const intervalId = setInterval(animationCycle, intervalMs)

    return () => {
      isMounted = false
      clearInterval(intervalId)
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
    }
  }, [isContinuousMode, from, incrementValue, intervalMs])

  // Target mode
  useEffect(() => {
    if (isContinuousMode || to === undefined) return

    const range = to - from
    const steps = calculateSteps(range, maxParticles, durationMs)
    if (steps.length === 0) return

    setCount(from)
    setParticles([])

    let isMounted = true
    const timeouts: ReturnType<typeof setTimeout>[] = []

    steps.forEach((step) => {
      const t = setTimeout(() => {
        if (!isMounted) return
        setCount(from + step.value)
        setIsValueAnimating(true)
        const id = nextIdRef.current++
        setParticles((prev) => [...prev, { id, value: step.incrementAmount }])

        const t1 = setTimeout(() => {
          if (isMounted) setIsValueAnimating(false)
        }, 500)
        timeouts.push(t1)
      }, step.timing)
      timeouts.push(t)
    })

    return () => {
      isMounted = false
      timeouts.forEach(clearTimeout)
    }
  }, [isContinuousMode, from, to, maxParticles, durationMs])

  return (
    <div
      className="pf-counter-showcase-fm"
      data-animation-id="text-effects__counter-increment"
      style={
        color !== undefined
          ? ({ '--text-effects-counter-increment-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className="pf-counter-showcase-fm__target">
        <m.span
          className="pf-counter-showcase-fm__value"
          variants={prefersReducedMotion ? undefined : numberPopVariants}
          initial="idle"
          animate={
            prefersReducedMotion
              ? isValueAnimating
                ? { scale: [1, 1.05, 1], opacity: [1, 0.85, 1] }
                : { scale: 1, opacity: 1 }
              : isValueAnimating
                ? 'pop'
                : 'idle'
          }
          transition={prefersReducedMotion ? { duration: 0.3, ease: 'easeInOut' } : undefined}
        >
          <span className="pf-counter-showcase-fm__value-text">
            {prefix !== undefined && (
              <span className="pf-counter-showcase-fm__label">{prefix}</span>
            )}
            {formatRef.current(count)}
            {suffix !== undefined && (
              <span className="pf-counter-showcase-fm__label">{suffix}</span>
            )}
          </span>
        </m.span>

        {!prefersReducedMotion &&
          particles.map((particle) => (
            <m.span
              key={particle.id}
              className="pf-update-indicator-fm__counter"
              variants={counterFloatVariants}
              initial="hidden"
              animate="float"
              onAnimationComplete={() => removeParticle(particle.id)}
            >
              +{formatRef.current(particle.value)}
            </m.span>
          ))}
      </div>
    </div>
  )
}

export const TextEffectsCounterIncrement = memo(TextEffectsCounterIncrementComponent)
