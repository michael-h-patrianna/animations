/**
 * Standalone: Copy this file + TextEffectsCounterIncrement.module.css into your app.
 * Runtime deps: react, motion
 * RN: Port pop variants + float variants to Moti useAnimatedStyle.
 */

import * as m from 'motion/react-m'
import { animate, easeOut, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
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

// ── Step calculation ──

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

// ── Particle pool constants ──

const CONTINUOUS_POOL_SIZE = 3
const PARTICLE_FLOAT_DURATION = 0.8

/**
 * Zero-rerender counter animation. Number display via useMotionValue+useTransform,
 * pop via imperative animate(), particles pre-rendered (target) or pooled (continuous).
 */
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
  const formatRef = useRef(formatValue)
  formatRef.current = formatValue
  const reducedMotionRef = useRef(prefersReducedMotion)
  reducedMotionRef.current = prefersReducedMotion

  const valueRef = useRef<HTMLSpanElement>(null)
  const poolRef = useRef<(HTMLDivElement | null)[]>([])

  const isContinuousMode = to === undefined

  // Motion value for the displayed count — updates bypass React reconciliation
  const count = useMotionValue(from)
  const displayCount = useTransform(count, (latest) => formatRef.current(latest))

  // Pre-compute target-mode steps for particle rendering
  const steps = useMemo(() => {
    if (isContinuousMode || to === undefined) return []
    const range = to - from
    if (range === 0) return []
    return calculateSteps(range, maxParticles, durationMs)
  }, [isContinuousMode, from, to, maxParticles, durationMs])

  // Imperative pop trigger via Motion animate() — stable (only refs)
  const triggerPop = useCallback(() => {
    if (!valueRef.current) return
    if (reducedMotionRef.current) {
      animate(valueRef.current, { scale: [1, 1.05, 1], opacity: [1, 0.85, 1] }, { duration: 0.3 })
    } else {
      animate(
        valueRef.current,
        {
          scale: [1, 1.2, 0.98, 1.08, 1],
          rotate: [0, 2, -2, 1, 0],
          opacity: [1, 1, 0.92, 1, 1],
        },
        { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
      )
    }
  }, [])

  // Imperative particle trigger via Motion animate() — stable (only refs)
  const triggerPoolParticle = useCallback((index: number, value: number) => {
    const el = poolRef.current[index % CONTINUOUS_POOL_SIZE]
    if (!el || reducedMotionRef.current) return
    el.textContent = `+${formatRef.current(value)}`
    animate(
      el,
      { y: [8, -4, -12, -16], opacity: [0, 1, 1, 0] },
      {
        duration: PARTICLE_FLOAT_DURATION,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }
    )
  }, [])

  // Target mode: instant jumps at precomputed milestone timings
  useEffect(() => {
    if (isContinuousMode || to === undefined || steps.length === 0) return

    count.set(from)

    const timeouts: ReturnType<typeof setTimeout>[] = []
    for (const step of steps) {
      timeouts.push(
        setTimeout(() => {
          count.set(from + step.value)
          triggerPop()
        }, step.timing)
      )
    }

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [count, isContinuousMode, from, to, steps, triggerPop])

  // Continuous mode: interval-driven motion value updates, zero state
  useEffect(() => {
    if (!isContinuousMode) return

    count.set(from)
    let poolIndex = 0

    const tick = () => {
      count.set(count.get() + incrementValue)
      triggerPop()
      triggerPoolParticle(poolIndex, incrementValue)
      poolIndex++
    }

    tick()
    const id = setInterval(tick, intervalMs)

    return () => clearInterval(id)
  }, [count, isContinuousMode, from, incrementValue, intervalMs, triggerPop, triggerPoolParticle])

  return (
    <div
      className={styles['pf-counter-showcase-fm']}
      data-animation-id="text-effects__counter-increment"
      style={
        color !== undefined
          ? ({ '--text-effects-counter-increment-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles['pf-counter-showcase-fm__target']}>
        <span ref={valueRef} className={styles['pf-counter-showcase-fm__value']}>
          <span className={styles['pf-counter-showcase-fm__value-text']}>
            {prefix !== undefined && (
              <span className={styles['pf-counter-showcase-fm__label']}>{prefix}</span>
            )}
            <m.span>{displayCount}</m.span>
            {suffix !== undefined && (
              <span className={styles['pf-counter-showcase-fm__label']}>{suffix}</span>
            )}
          </span>
        </span>

        {/* Target mode: pre-rendered particles with Motion delays */}
        {!prefersReducedMotion &&
          !isContinuousMode &&
          steps.map((step, i) => (
            <m.span
              key={i}
              className={styles['pf-update-indicator-fm__counter']}
              initial={{ y: 8, opacity: 0 }}
              animate={{
                y: [8, -4, -12, -16],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: PARTICLE_FLOAT_DURATION,
                delay: step.timing / 1000,
                ease: easeOut,
                times: [0, 0.2, 0.5, 1],
              }}
            >
              +{formatRef.current(step.incrementAmount)}
            </m.span>
          ))}

        {/* Continuous mode: reusable particle pool (imperatively animated) */}
        {isContinuousMode &&
          Array.from({ length: CONTINUOUS_POOL_SIZE }, (_, i) => (
            <div
              key={`pool-${i}`}
              ref={(el) => {
                poolRef.current[i] = el
              }}
              className={styles['pf-update-indicator-fm__counter']}
              style={{ opacity: 0 }}
            />
          ))}
      </div>
    </div>
  )
}

export const TextEffectsCounterIncrement = memo(TextEffectsCounterIncrementComponent)
