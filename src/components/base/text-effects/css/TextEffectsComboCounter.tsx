import { memo, useEffect, useMemo, useState } from 'react'
import './TextEffectsComboCounter.css'

interface Milestone {
  trigger: number
  value: number
}

interface TextEffectsComboCounterProps {
  /** @default 25 */
  finalValue?: number
  /** @default 4 */
  maxParticles?: number
}

/**
 * Calculates evenly distributed milestone particles.
 * Limits particle count for small numbers to avoid +1 spam.
 */
function calculateMilestones(finalValue: number, maxParticles: number): Milestone[] {
  // Don't show more particles than makes sense (avoid +1, +1, +1...)
  const numParticles = Math.min(
    maxParticles,
    Math.max(1, Math.floor(finalValue / 2))
  )

  const milestones: Milestone[] = []

  for (let i = 0; i < numParticles; i++) {
    const progress = (i + 1) / numParticles
    const triggerValue = Math.round(finalValue * progress)

    // Calculate increment since last milestone
    const lastValue = i > 0 ? milestones[i - 1].trigger : 0
    const increment = triggerValue - lastValue

    milestones.push({
      trigger: triggerValue,
      value: increment
    })
  }

  return milestones
}

/**
 * Combo counter animation that counts from 0 to a target value with milestone particles.
 *
 * @example
 * <TextEffectsComboCounter />
 * <TextEffectsComboCounter finalValue={100} maxParticles={6} />
 */
function TextEffectsComboCounterComponent({
  finalValue = 25,
  maxParticles = 4
}: TextEffectsComboCounterProps = {}) {
  const comboText = 'COMBO'
  const [count, setCount] = useState(0)

  // Calculate milestones dynamically based on finalValue
  const milestones = useMemo(
    () => calculateMilestones(finalValue, maxParticles),
    [finalValue, maxParticles]
  )

  useEffect(() => {
    // Counter animation - only essential JavaScript
    const startTime = performance.now()
    const duration = 1200
    const delay = 350

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime - delay
      if (elapsed < 0) {
        requestAnimationFrame(animateCount)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      // Custom easing approximation
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const newCount = Math.round(eased * finalValue)
      setCount(newCount)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    requestAnimationFrame(animateCount)
  }, [finalValue])

  // Calculate animation delay for each particle based on when counter reaches trigger
  const getParticleDelay = (triggerValue: number): number => {
    const triggerProgress = triggerValue / finalValue
    return 350 + triggerProgress * 1200 // delay + (progress * duration)
  }

  return (
    <div className="tfx-combo-container" data-animation-id="text-effects__combo-counter">
      <div className="tfx-combo-main">
        <div className="tfx-combo-number-wrapper">
          <div className="tfx-combo-number-container">
            <div className="tfx-combo-current-number">
              <span className="tfx-combo-digit">
                <span>{count}</span>
              </span>
            </div>

            {milestones.map((milestone, i) => (
              <div
                key={i}
                className="tfx-combo-particle"
                style={{
                  animationDelay: `${getParticleDelay(milestone.trigger)}ms`
                }}
              >
                +{milestone.value}
              </div>
            ))}
          </div>

          <div className="tfx-combo-hit-marker">
            ×
          </div>
        </div>

        <div className="tfx-combo-text-wrapper">
          {comboText.split('').map((char, index) => (
            <span
              key={index}
              className="tfx-combo-letter"
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="tfx-combo-bonus">
        PERFECT!
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsComboCounter to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsComboCounter = memo(TextEffectsComboCounterComponent)

