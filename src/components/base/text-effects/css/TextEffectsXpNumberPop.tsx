import { memo, useEffect, useMemo, useState } from 'react'
import './TextEffectsXpNumberPop.css'

interface Particle {
  trigger: number
  value: number
  x: number
  y: number
  delay: number
}

interface TextEffectsXpNumberPopProps {
  /** @default 240 */
  finalValue?: number
  /** @default 10 */
  maxParticles?: number
}

/**
 * Calculates radially distributed particle values that sum to the final XP total.
 * Limits particle count for small numbers and distributes them in circular layers.
 */
function calculateParticles(finalValue: number, maxParticles: number): Particle[] {
  // Don't show more particles than makes sense (avoid +1 spam)
  const numParticles = Math.min(
    maxParticles,
    Math.max(1, Math.floor(finalValue / 5))
  )

  const particles: Particle[] = []
  const duration = 2500
  const particlesPerLayer = 5

  for (let i = 0; i < numParticles; i++) {
    const progress = (i + 1) / numParticles
    const triggerValue = Math.round(finalValue * progress)

    // Calculate increment since last particle
    const lastValue = i > 0 ? particles[i - 1].trigger : 0
    const increment = triggerValue - lastValue

    // Calculate circular position (5 particles per layer)
    const angleIndex = i % particlesPerLayer
    const angle = (angleIndex / particlesPerLayer) * Math.PI * 2
    const layer = Math.floor(i / particlesPerLayer)
    const radius = 60 + layer * 20

    particles.push({
      trigger: triggerValue,
      value: increment,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: 400 + progress * duration // Start after number entrance
    })
  }

  return particles
}

/**
 * XP number pop animation that counts to a target value with floating increment particles.
 *
 * @example
 * <TextEffectsXpNumberPop />
 * <TextEffectsXpNumberPop finalValue={1000} maxParticles={8} />
 */
function TextEffectsXpNumberPopComponent({
  finalValue = 240,
  maxParticles = 10
}: TextEffectsXpNumberPopProps = {}) {
  const [count, setCount] = useState(0)

  // Calculate particles dynamically based on finalValue
  const particles = useMemo(
    () => calculateParticles(finalValue, maxParticles),
    [finalValue, maxParticles]
  )

  useEffect(() => {
    // Counter animation - only essential JavaScript
    const startTime = performance.now()
    const duration = 2500
    const delay = 0

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime - delay
      if (elapsed < 0) {
        requestAnimationFrame(animateCount)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3)

      const newCount = Math.round(eased * finalValue)
      setCount(newCount)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    requestAnimationFrame(animateCount)
  }, [finalValue])

  return (
    <div className="txnp-container" data-animation-id="text-effects__xp-number-pop">
      {/* Floating particles with calculated positions and delays */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="txnp-particle"
          style={{
            '--particle-x': `${particle.x}px`,
            '--particle-y': `${particle.y}px`,
            animationDelay: `${particle.delay}ms`
          } as React.CSSProperties}
        >
          +{particle.value}
        </div>
      ))}

      {/* Main number with XP label */}
      <div className="txnp-number-wrapper">
        <span className="txnp-number-value">
          +{count}
        </span>
        <span className="txnp-label">
          XP
        </span>
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsXpNumberPop to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsXpNumberPop = memo(TextEffectsXpNumberPopComponent)

