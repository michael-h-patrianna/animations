/**
 * Standalone: Copy this file + TextEffectsCounterIncrement.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import styles from './TextEffectsCounterIncrement.module.css'

interface Particle {
  id: number
  value: number
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
  /** Target mode: total animation duration in ms. @default 3000 */
  durationMs?: number
  /** Target mode: number of increment steps/particles. @default 8 */
  maxParticles?: number
  /** Continuous mode: fixed increment amount. @default 1 */
  incrementValue?: number
  /** Continuous mode: milliseconds between increments. @default 2000 */
  intervalMs?: number
  /** Base color for number, glow, and particles. Gradient stops are computed. @default '#c6ff77' */
  color?: string
}

const defaultFormat = (n: number): string => Math.round(n).toLocaleString()

interface IncrementStep {
  value: number
  timing: number
  incrementAmount: number
}

function roundToNiceNumber(num: number): number {
  if (num === 0) return 0
  const numStr = Math.abs(num).toString()
  const magnitude = 10 ** (numStr.length - 1)
  const normalized = num / magnitude
  if (normalized < 1.5) return magnitude
  if (normalized < 2.25) return 2 * magnitude
  if (normalized < 3.5) return 2.5 * magnitude
  if (normalized < 7.5) return 5 * magnitude
  return 10 * magnitude
}

function calculateIncrementSteps(
  range: number,
  numSteps: number,
  durationMs: number
): IncrementStep[] {
  if (numSteps <= 0) return []
  const steps: IncrementStep[] = []
  let cumulativeValue = 0
  const easeInCubic = (t: number): number => t * t * t

  for (let i = 0; i < numSteps; i++) {
    const progress = (i + 1) / numSteps
    const easedProgress = easeInCubic(progress)
    const targetAtStep = Math.round(range * easedProgress)
    let incrementAmount = targetAtStep - cumulativeValue
    if (incrementAmount > 10) {
      incrementAmount = roundToNiceNumber(incrementAmount)
    }
    if (cumulativeValue + incrementAmount > range) {
      incrementAmount = range - cumulativeValue
    }
    if (incrementAmount <= 0) continue
    cumulativeValue += incrementAmount
    const timingAtStep = Math.round(durationMs * easedProgress)
    steps.push({ value: cumulativeValue, timing: timingAtStep, incrementAmount })
  }

  if (cumulativeValue < range) {
    const remaining = range - cumulativeValue
    if (steps.length > 0) {
      const lastStep = steps[steps.length - 1]!
      lastStep.value = range
      lastStep.incrementAmount += remaining
      lastStep.timing = durationMs
    } else {
      steps.push({ value: range, timing: durationMs, incrementAmount: range })
    }
  }
  return steps
}

/**
 * Standalone: Copy this file + TextEffectsCounterIncrement.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsCounterIncrementComponent({
  from = 0,
  to,
  prefix,
  suffix,
  formatValue = defaultFormat,
  durationMs,
  maxParticles,
  incrementValue,
  intervalMs,
  color,
}: TextEffectsCounterIncrementProps = {}) {
  const [count, setCount] = useState(from)
  const [particles, setParticles] = useState<Particle[]>([])
  const nextParticleIdRef = useRef(0)
  const [popKey, setPopKey] = useState(0)
  const formatRef = useRef(formatValue)
  formatRef.current = formatValue

  const isContinuousMode = to === undefined
  const effectiveDuration = durationMs ?? (isContinuousMode ? (intervalMs ?? 2000) : 3000)
  const effectiveMaxParticles = maxParticles ?? (isContinuousMode ? 1 : 8)
  const continuousIncrement = incrementValue ?? 1

  const handleParticleAnimationEnd = useCallback((particleId: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== particleId))
  }, [])

  // Target mode
  useEffect(() => {
    if (isContinuousMode || to === undefined) return
    const range = to - from
    if (range === 0) return
    const steps = calculateIncrementSteps(range, effectiveMaxParticles, effectiveDuration)
    if (steps.length === 0) return

    setCount(from)
    setParticles([])
    nextParticleIdRef.current = 0
    setPopKey(0)

    const timeouts: ReturnType<typeof setTimeout>[] = []
    steps.forEach((step: IncrementStep) => {
      const timeoutId = setTimeout(() => {
        setCount(from + step.value)
        setPopKey((k) => k + 1)
        const particleId = nextParticleIdRef.current++
        const newParticle = { id: particleId, value: step.incrementAmount }
        setParticles((prev) => {
          const newParticles = [...prev, newParticle]
          return newParticles.slice(-effectiveMaxParticles)
        })
      }, step.timing)
      timeouts.push(timeoutId)
    })
    return () => {
      timeouts.forEach((id) => clearTimeout(id))
    }
  }, [from, to, effectiveDuration, effectiveMaxParticles, isContinuousMode])

  // Continuous mode
  useEffect(() => {
    if (!isContinuousMode) return
    const performIncrement = () => {
      setCount((prev) => prev + continuousIncrement)
      setPopKey((k) => k + 1)
      const particleId = nextParticleIdRef.current++
      setParticles((prev) => {
        const newParticles = [...prev, { id: particleId, value: continuousIncrement }]
        return newParticles.slice(-effectiveMaxParticles)
      })
    }
    setCount(from)
    performIncrement()
    const intervalId = setInterval(performIncrement, effectiveDuration)
    return () => {
      clearInterval(intervalId)
    }
  }, [isContinuousMode, from, continuousIncrement, effectiveDuration, effectiveMaxParticles])

  return (
    <div
      className={styles['tfx-cinc-container']}
      data-testid="counter-container"
      data-animation-id="text-effects__counter-increment"
      style={
        color !== undefined
          ? ({ '--text-effects-counter-increment-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles['tfx-cinc-value-wrapper']}>
        <span
          key={popKey}
          className={`${styles['tfx-cinc-value']} ${styles['tfx-cinc-value--popping']}`}
          data-testid="counter-value"
        >
          {prefix !== undefined && <span className={styles['tfx-cinc-label']}>{prefix}</span>}
          {formatRef.current(count)}
          {suffix !== undefined && <span className={styles['tfx-cinc-label']}>{suffix}</span>}
        </span>

        {particles.map((particle) => (
          <span
            key={particle.id}
            className={styles['tfx-cinc-particle']}
            onAnimationEnd={() => handleParticleAnimationEnd(particle.id)}
          >
            +{formatRef.current(particle.value)}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsCounterIncrement = memo(TextEffectsCounterIncrementComponent)
