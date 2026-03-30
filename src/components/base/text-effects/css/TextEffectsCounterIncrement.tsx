/**
 * Standalone: Copy this file + TextEffectsCounterIncrement.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import styles from './TextEffectsCounterIncrement.module.css'

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

// ── WAAPI keyframes (replace CSS class remount with imperative animation) ──

const POP_KEYFRAMES: Keyframe[] = [
  { transform: 'scale3d(1, 1, 1) rotate3d(0, 0, 1, 0deg)', opacity: 1 },
  { transform: 'scale3d(1.2, 1.2, 1) rotate3d(0, 0, 1, 2deg)', opacity: 1, offset: 0.25 },
  { transform: 'scale3d(0.98, 0.98, 1) rotate3d(0, 0, 1, -2deg)', opacity: 0.92, offset: 0.5 },
  { transform: 'scale3d(1.08, 1.08, 1) rotate3d(0, 0, 1, 1deg)', opacity: 1, offset: 0.75 },
  { transform: 'scale3d(1, 1, 1) rotate3d(0, 0, 1, 0deg)', opacity: 1 },
]

const REDUCED_POP_KEYFRAMES: Keyframe[] = [
  { transform: 'scale(1)', opacity: 1 },
  { transform: 'scale(1.05)', opacity: 0.85, offset: 0.5 },
  { transform: 'scale(1)', opacity: 1 },
]

const PARTICLE_FLOAT_KEYFRAMES: Keyframe[] = [
  { transform: 'translate3d(0, 8px, 0) scale(0.8)', opacity: 0 },
  { transform: 'translate3d(0, -4px, 0) scale(1)', opacity: 1, offset: 0.2 },
  { transform: 'translate3d(0, -12px, 0) scale(1)', opacity: 1, offset: 0.5 },
  { transform: 'translate3d(0, -20px, 0) scale(0.9)', opacity: 0 },
]

const CONTINUOUS_POOL_SIZE = 3

// ── Step calculation (shared between target-mode rendering and effect) ──

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
 * Zero-rerender counter animation. Number updates via ref.textContent,
 * pop animation via WAAPI, particles pre-rendered (target) or pooled (continuous).
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
  const numberRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)
  const poolRef = useRef<(HTMLSpanElement | null)[]>([])
  const formatRef = useRef(formatValue)
  formatRef.current = formatValue

  const reducedMotionRef = useRef(false)

  const isContinuousMode = to === undefined
  const effectiveDuration = durationMs ?? (isContinuousMode ? (intervalMs ?? 2000) : 3000)
  const effectiveMaxParticles = maxParticles ?? (isContinuousMode ? 1 : 8)
  const continuousIncrement = incrementValue ?? 1

  // Pre-compute target-mode steps for particle rendering
  const steps = useMemo(() => {
    if (isContinuousMode || to === undefined) return []
    const range = to - from
    if (range === 0) return []
    return calculateIncrementSteps(range, effectiveMaxParticles, effectiveDuration)
  }, [isContinuousMode, from, to, effectiveMaxParticles, effectiveDuration])

  // Track reduced-motion preference reactively (no state — just a ref)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Imperative pop trigger via WAAPI — stable (only refs)
  const triggerPop = useCallback(() => {
    if (!valueRef.current) return
    const reduced = reducedMotionRef.current
    valueRef.current.animate(reduced ? REDUCED_POP_KEYFRAMES : POP_KEYFRAMES, {
      duration: reduced ? 300 : 500,
      easing: reduced ? 'ease-in-out' : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    })
  }, [])

  // Target mode: update number at precomputed milestone timings
  useEffect(() => {
    if (isContinuousMode || to === undefined || steps.length === 0) return

    if (numberRef.current) numberRef.current.textContent = formatRef.current(from)

    const timeouts: ReturnType<typeof setTimeout>[] = []
    for (const step of steps) {
      timeouts.push(
        setTimeout(() => {
          if (numberRef.current)
            numberRef.current.textContent = formatRef.current(from + step.value)
          triggerPop()
        }, step.timing)
      )
    }

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [isContinuousMode, from, to, steps, triggerPop])

  // Continuous mode: interval-driven DOM updates, zero state
  useEffect(() => {
    if (!isContinuousMode) return

    let currentCount = from
    let poolIndex = 0

    if (numberRef.current) numberRef.current.textContent = formatRef.current(from)

    const tick = () => {
      currentCount += continuousIncrement
      if (numberRef.current) numberRef.current.textContent = formatRef.current(currentCount)
      triggerPop()

      if (!reducedMotionRef.current) {
        const el = poolRef.current[poolIndex % CONTINUOUS_POOL_SIZE]
        if (el) {
          el.textContent = `+${formatRef.current(continuousIncrement)}`
          el.getAnimations().forEach((a) => a.cancel())
          el.animate(PARTICLE_FLOAT_KEYFRAMES, {
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'both',
          })
        }
        poolIndex++
      }
    }

    tick()
    const id = setInterval(tick, effectiveDuration)

    return () => clearInterval(id)
  }, [isContinuousMode, from, continuousIncrement, effectiveDuration, triggerPop])

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
        <span ref={valueRef} className={styles['tfx-cinc-value']}>
          {prefix !== undefined && <span className={styles['tfx-cinc-label']}>{prefix}</span>}
          <span ref={numberRef}>{formatRef.current(from)}</span>
          {suffix !== undefined && <span className={styles['tfx-cinc-label']}>{suffix}</span>}
        </span>

        {/* Target mode: pre-rendered particles with CSS animation-delay */}
        {!isContinuousMode &&
          steps.map((step, i) => (
            <span
              key={i}
              className={styles['tfx-cinc-particle']}
              style={{ animationDelay: `${step.timing}ms` }}
            >
              +{formatRef.current(step.incrementAmount)}
            </span>
          ))}

        {/* Continuous mode: reusable particle pool (WAAPI-driven) */}
        {isContinuousMode &&
          Array.from({ length: CONTINUOUS_POOL_SIZE }, (_, i) => (
            <span
              key={`pool-${i}`}
              ref={(el) => {
                poolRef.current[i] = el
              }}
              className={styles['tfx-cinc-particle-slot']}
            />
          ))}
      </div>
    </div>
  )
}

export const TextEffectsCounterIncrement = memo(TextEffectsCounterIncrementComponent)
