/**
 * Standalone: Copy this file + TextEffectsXpNumberPop.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useEffect, useMemo, useRef } from 'react'
import styles from './TextEffectsXpNumberPop.module.css'

interface Particle {
  trigger: number
  value: number
  x: number
  y: number
  delay: number
}

interface TextEffectsXpNumberPopProps {
  /** Starting value of the count-up. @default 0 */
  from?: number
  /** Target value to count up to. @default 240 */
  to?: number
  /** Text before the number (e.g. "$", "+"). */
  prefix?: string
  /** Text after the number (e.g. " XP", " pts", " €"). @default ' XP' */
  suffix?: string
  /** Custom number formatting. Receives the current number, returns display string. @default Math.round(n).toLocaleString() */
  formatValue?: (n: number) => string
  /** Maximum floating particles. Auto-scales down for small ranges. @default 10 */
  maxParticles?: number
  /** Base color for number, particles, and label. Gradient stops are computed. @default '#c6ff77' */
  color?: string
}

const defaultFormat = (n: number): string => Math.round(n).toLocaleString()

/**
 * Calculates radially distributed particle values that sum to the count range.
 * Limits particle count for small ranges and distributes them in circular layers.
 */
function calculateParticles(range: number, maxParticles: number): Particle[] {
  const absRange = Math.abs(range)
  const numParticles = Math.min(maxParticles, Math.max(1, Math.floor(absRange / 5)))

  const particles: Particle[] = []
  const duration = 2500
  const particlesPerLayer = 5

  for (let i = 0; i < numParticles; i++) {
    const progress = (i + 1) / numParticles
    const cumulative = Math.round(absRange * progress)

    const prev = i > 0 ? particles[i - 1]!.trigger : 0
    const increment = cumulative - prev

    const angleIndex = i % particlesPerLayer
    const angle = (angleIndex / particlesPerLayer) * Math.PI * 2
    const layer = Math.floor(i / particlesPerLayer)
    const radius = 60 + layer * 20

    particles.push({
      trigger: cumulative,
      value: increment,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: 400 + progress * duration,
    })
  }

  return particles
}

/**
 * Standalone: Copy this file + TextEffectsXpNumberPop.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsXpNumberPopComponent({
  from = 0,
  to = 240,
  prefix,
  suffix = ' XP',
  formatValue = defaultFormat,
  maxParticles = 10,
  color,
}: TextEffectsXpNumberPopProps) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const formatRef = useRef(formatValue)
  formatRef.current = formatValue

  const range = to - from
  const particles = useMemo(() => calculateParticles(range, maxParticles), [range, maxParticles])

  useEffect(() => {
    const startTime = performance.now()
    const duration = 2500
    let isActive = true
    let frameId = 0

    const animateCount = (currentTime: number) => {
      if (!isActive) return

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      if (numberRef.current) {
        numberRef.current.textContent = formatRef.current(from + eased * range)
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount)
      }
    }

    frameId = requestAnimationFrame(animateCount)

    return () => {
      isActive = false
      cancelAnimationFrame(frameId)
    }
  }, [from, to, range])

  return (
    <div
      className={styles['tfx-xp-container']}
      data-animation-id="text-effects__xp-number-pop"
      data-testid="xp-container"
      style={
        color !== undefined
          ? ({ '--text-effects-xp-number-pop-color': color } as React.CSSProperties)
          : undefined
      }
    >
      {/* Floating particles with calculated positions and delays */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className={styles['tfx-xp-particle']}
          data-testid="xp-particle"
          style={
            {
              '--particle-x': `${particle.x}px`,
              '--particle-y': `${particle.y}px`,
              animationDelay: `${particle.delay}ms`,
            } as React.CSSProperties
          }
        >
          +{formatRef.current(particle.value)}
        </div>
      ))}

      {/* Main number with labels */}
      <div className={styles['tfx-xp-number-wrapper']}>
        {prefix !== undefined && (
          <span
            className={`${styles['tfx-xp-label']} ${styles['tfx-xp-label--prefix']}`}
            data-testid="xp-label"
          >
            {prefix}
          </span>
        )}
        <span
          ref={numberRef}
          className={styles['tfx-xp-number-value']}
          data-testid="xp-number-value"
        >
          {formatRef.current(from)}
        </span>
        {suffix !== undefined && (
          <span className={styles['tfx-xp-label']} data-testid="xp-label">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export const TextEffectsXpNumberPop = memo(TextEffectsXpNumberPopComponent)
