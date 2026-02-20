import { useCallback, useEffect, useRef, useState } from 'react'
import './TextEffectsCounterIncrement.css'

interface Particle {
  id: number
  value: number
}

interface TextEffectsCounterIncrementProps {
  /** Target value to count to. If not set, runs in continuous demo mode. @default undefined */
  targetValue?: number
  /** Total animation duration in milliseconds. @default 2000 for continuous, 3000 for target mode */
  durationMs?: number
  /** Number of increment steps/particles to show. @default 1 for continuous, 8 for target mode */
  maxParticles?: number
  /** Animation ID for data-animation-id attribute. @default 'text-effects__counter-increment' */
  animationId?: string
  /** Legacy: Fixed increment value for continuous mode. @deprecated Use durationMs and maxParticles instead */
  incrementValue?: number
  /** Legacy: Time between increments. @deprecated Use durationMs instead */
  intervalMs?: number
}

interface IncrementStep {
  value: number
  timing: number
  incrementAmount: number
}

/**
 * Rounds a number to a "nice" value based on its magnitude.
 * Examples: 1234 → 1200, 567 → 550, 89 → 90, 7 → 5
 */
function roundToNiceNumber(num: number): number {
  if (num === 0) return 0

  // Find magnitude using string length (faster than log10)
  const numStr = Math.abs(num).toString()
  const magnitude = 10 ** (numStr.length - 1)
  const normalized = num / magnitude

  // Round to 1, 2, 2.5, or 5 * magnitude
  if (normalized < 1.5) return magnitude
  if (normalized < 2.25) return 2 * magnitude
  if (normalized < 3.5) return 2.5 * magnitude
  if (normalized < 7.5) return 5 * magnitude
  return 10 * magnitude
}

/**
 * Calculates increment steps using an easing curve for game-like score counter effect.
 * Uses ease-in curve: starts slow with small jumps, accelerates with larger jumps toward the end.
 */
function calculateIncrementSteps(
  targetValue: number,
  numSteps: number,
  durationMs: number
): IncrementStep[] {
  if (numSteps <= 0) return []

  const steps: IncrementStep[] = []
  let cumulativeValue = 0

  // Ease-in cubic curve: y = x^3
  // This makes values start slow and accelerate (small increments → large increments)
  const easeInCubic = (t: number): number => {
    return t * t * t
  }

  for (let i = 0; i < numSteps; i++) {
    const progress = (i + 1) / numSteps
    const easedProgress = easeInCubic(progress)

    // Calculate target value at this step (cumulative)
    const targetAtStep = Math.round(targetValue * easedProgress)

    // Calculate the actual increment for this step
    let incrementAmount = targetAtStep - cumulativeValue

    // Round increment to nice number for visual appeal (but not for small values)
    if (incrementAmount > 10) {
      incrementAmount = roundToNiceNumber(incrementAmount)
    }

    // Ensure we don't overshoot the final target
    if (cumulativeValue + incrementAmount > targetValue) {
      incrementAmount = targetValue - cumulativeValue
    }

    // Skip if no increment (can happen with rounding)
    if (incrementAmount <= 0) continue

    cumulativeValue += incrementAmount

    // Calculate cumulative timing using ease-in
    // This makes intervals shorter at start, longer at end (slow → fast)
    const timingAtStep = Math.round(durationMs * easedProgress)

    steps.push({
      value: cumulativeValue,
      timing: timingAtStep,
      incrementAmount
    })
  }

  // Ensure we reach exactly the target value
  if (cumulativeValue < targetValue) {
    const remaining = targetValue - cumulativeValue

    if (steps.length > 0) {
      // Add remaining to last step
      const lastStep = steps[steps.length - 1]
      lastStep.value = targetValue
      lastStep.incrementAmount += remaining
      lastStep.timing = durationMs
    } else {
      // If no steps, create one
      steps.push({
        value: targetValue,
        timing: durationMs,
        incrementAmount: targetValue
      })
    }
  }

  return steps
}

/**
 * Counter increment animation showing number growth with floating increment particles.
 * Works with any number from 1 to millions with smart increment sizing.
 *
 * @example
 * // Continuous demo mode (default)
 * <TextEffectsCounterIncrement />
 *
 * @example
 * // Count to specific target with auto-calculated increments
 * <TextEffectsCounterIncrement targetValue={1000} />
 *
 * @example
 * // Count to target with custom increment and timing
 * <TextEffectsCounterIncrement
 *   targetValue={10000}
 *   incrementValue={500}
 *   intervalMs={1000}
 * />
 */
function TextEffectsCounterIncrementComponent({
  targetValue,
  durationMs,
  maxParticles,
  animationId = 'text-effects__counter-increment',
  // Legacy props for backward compatibility
  incrementValue,
  intervalMs
}: TextEffectsCounterIncrementProps = {}) {
  const [count, setCount] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const nextParticleIdRef = useRef(0)
  const popAnimationKeyRef = useRef(0)

  // Determine if running in continuous mode or target mode
  const isContinuousMode = targetValue === undefined

  // Set defaults based on mode
  const effectiveDuration = durationMs ?? (isContinuousMode ? (intervalMs ?? 2000) : 3000)
  const effectiveMaxParticles = maxParticles ?? (isContinuousMode ? 1 : 8)

  // For continuous mode, use simple increment
  const continuousIncrement = incrementValue ?? 1

  // Remove particle after animation completes
  const handleParticleAnimationEnd = useCallback((particleId: number) => {
    setParticles(prev => prev.filter(p => p.id !== particleId))
  }, [])

  // Target mode: calculate steps and execute animation (runs once on mount per instance)
  useEffect(() => {
    if (isContinuousMode) return
    if (!targetValue) return

    // Calculate increment steps for THIS instance
    const steps = calculateIncrementSteps(targetValue, effectiveMaxParticles, effectiveDuration)

    if (steps.length === 0) return

    // Reset to start state
    setCount(0)
    setParticles([])
    nextParticleIdRef.current = 0
    popAnimationKeyRef.current = 0

    const timeouts: ReturnType<typeof setTimeout>[] = []

    steps.forEach((step: IncrementStep) => {
      const timeoutId = setTimeout(() => {
        setCount(step.value)
        popAnimationKeyRef.current++

        // Add particle
        const particleId = nextParticleIdRef.current++
        const newParticle = { id: particleId, value: step.incrementAmount }

        setParticles(prev => {
          const newParticles = [...prev, newParticle]
          // Keep only recent particles (they auto-remove via animation)
          return newParticles.slice(-effectiveMaxParticles)
        })
      }, step.timing)

      timeouts.push(timeoutId)
    })

    return () => {
      // Clean up ALL timeouts for this instance
      timeouts.forEach(clearTimeout)
    }
  }, [targetValue, effectiveDuration, effectiveMaxParticles, isContinuousMode])  // Continuous mode: simple interval-based increment
  useEffect(() => {
    if (!isContinuousMode) return

    const performIncrement = () => {
      setCount(prev => prev + continuousIncrement)
      popAnimationKeyRef.current++

      const particleId = nextParticleIdRef.current++
      setParticles(prev => {
        const newParticles = [...prev, { id: particleId, value: continuousIncrement }]
        return newParticles.slice(-effectiveMaxParticles)
      })
    }

    // Start immediately
    performIncrement()

    // Set up interval
    const intervalId = setInterval(performIncrement, effectiveDuration)

    return () => {
      clearInterval(intervalId)
    }
  }, [isContinuousMode, continuousIncrement, effectiveDuration, effectiveMaxParticles])

  return (
    <div
      className="tfx-cinc-container"
      data-animation-id={animationId}
    >
      <div className="tfx-cinc-value-wrapper">
        <span
          key={popAnimationKeyRef.current}
          className="tfx-cinc-value tfx-cinc-value--popping"
        >
          {count.toLocaleString()}
        </span>

        {particles.map(particle => (
          <span
            key={particle.id}
            className="tfx-cinc-particle"
            onAnimationEnd={() => handleParticleAnimationEnd(particle.id)}
          >
            +{particle.value.toLocaleString()}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * TextEffectsCounterIncrement - runs in continuous demo mode, incrementing by 1 every 2 seconds.
 * Each instance is completely independent with its own state and animations.
 */
export const TextEffectsCounterIncrement = TextEffectsCounterIncrementComponent

/**
 * Fast count-up variant that demonstrates counting from 0 to 9,999.
 * Uses game-like score counter with ease-out curve for exciting visual effect.
 * Completes animation in 4 seconds with 12 increment steps.
 */
export function TextEffectsCounterIncrement9999() {
  return (
    <TextEffectsCounterIncrementComponent
      targetValue={9999}
      durationMs={4000}
      maxParticles={25}
      animationId="text-effects__counter-increment-9999"
    />
  )
}

