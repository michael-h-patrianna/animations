/**
 * Standalone: Copy this file + TextEffectsComboCounter.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import './TextEffectsComboCounter.css'

interface Milestone {
  trigger: number
  value: number
}

interface TextEffectsComboCounterProps {
  /** Starting value. @default 0 */
  from?: number
  /** Target combo count. @default 25 */
  to?: number
  /** Label text next to the counter (e.g. 'COMBO', 'STREAK', 'KILLS'). @default 'COMBO' */
  label?: string
  /** Celebration text at the end. Set to undefined to hide. @default 'PERFECT!' */
  bonusText?: string
  /** Custom number formatting. @default Math.round(n).toLocaleString() */
  formatValue?: (n: number) => string
  /** Maximum number of milestone particles. @default 4 */
  maxParticles?: number
}

const defaultFormat = (n: number): string => Math.round(n).toLocaleString()

function calculateMilestones(range: number, maxParticles: number): Milestone[] {
  const absRange = Math.abs(range)
  const numParticles = Math.min(maxParticles, Math.max(1, Math.floor(absRange / 2)))
  const milestones: Milestone[] = []

  for (let i = 0; i < numParticles; i++) {
    const progress = (i + 1) / numParticles
    const triggerValue = Math.round(absRange * progress)
    const lastValue = i > 0 ? milestones[i - 1]!.trigger : 0
    const increment = triggerValue - lastValue

    milestones.push({ trigger: triggerValue, value: increment })
  }

  return milestones
}

/**
 * Combo counter with milestone particles and celebration text.
 *
 * @example
 * <TextEffectsComboCounter />
 * <TextEffectsComboCounter to={100} label="STREAK" bonusText="ON FIRE!" />
 * <TextEffectsComboCounter from={0} to={50} label="KILLS" bonusText="RAMPAGE!" maxParticles={6} />
 */
function TextEffectsComboCounterComponent({
  from = 0,
  to = 25,
  label = 'COMBO',
  bonusText = 'PERFECT!',
  formatValue = defaultFormat,
  maxParticles = 4,
}: TextEffectsComboCounterProps = {}) {
  const [count, setCount] = useState(from)
  const formatRef = useRef(formatValue)
  formatRef.current = formatValue

  const range = to - from
  const milestones = useMemo(() => calculateMilestones(range, maxParticles), [range, maxParticles])

  useEffect(() => {
    const startTime = performance.now()
    const duration = 1200
    const delay = 350
    let isActive = true
    let frameId = 0

    const animateCount = (currentTime: number) => {
      if (!isActive) return

      const elapsed = currentTime - startTime - delay
      if (elapsed < 0) {
        frameId = requestAnimationFrame(animateCount)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      const eased =
        progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

      setCount(from + eased * range)

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

  const getParticleDelay = (triggerValue: number): number => {
    const triggerProgress = triggerValue / Math.abs(range)
    return 350 + triggerProgress * 1200
  }

  return (
    <div className="tfx-combo-container" data-animation-id="text-effects__combo-counter">
      <div className="tfx-combo-main">
        <div className="tfx-combo-number-wrapper">
          <div className="tfx-combo-number-container">
            <div className="tfx-combo-current-number">
              <span className="tfx-combo-digit">
                <span>{formatRef.current(count)}</span>
              </span>
            </div>

            {milestones.map((milestone, i) => (
              <div
                key={i}
                className="tfx-combo-particle"
                style={{
                  animationDelay: `${getParticleDelay(milestone.trigger)}ms`,
                }}
              >
                +{formatRef.current(milestone.value)}
              </div>
            ))}
          </div>

          <div className="tfx-combo-hit-marker">×</div>
        </div>

        <div className="tfx-combo-text-wrapper">
          {label.split('').map((char, index) => (
            <span key={index} className="tfx-combo-letter">
              {char}
            </span>
          ))}
        </div>
      </div>

      {bonusText !== undefined && <div className="tfx-combo-bonus">{bonusText}</div>}
    </div>
  )
}

export const TextEffectsComboCounter = memo(TextEffectsComboCounterComponent)
