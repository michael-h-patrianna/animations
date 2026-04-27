/**
 * Standalone: Copy this file + TextEffectsComboCounter.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useEffect, useMemo, useRef } from 'react'
import styles from './TextEffectsComboCounter.module.css'

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
  /** Number gradient base color. @default '#ef4444' */
  numberColor?: string
  /** Label and hit-marker color. @default '#f59e0b' */
  labelColor?: string
  /** Bonus text color. @default '#ffd700' */
  bonusColor?: string
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
 * Standalone: Copy this file + TextEffectsComboCounter.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsComboCounterComponent({
  from = 0,
  to = 25,
  label = 'COMBO',
  bonusText = 'PERFECT!',
  formatValue = defaultFormat,
  maxParticles = 4,
  numberColor,
  labelColor,
  bonusColor,
}: TextEffectsComboCounterProps = {}) {
  const numberRef = useRef<HTMLSpanElement>(null)
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

  const getParticleData = (milestone: Milestone, i: number) => {
    const angle = -90 + i * 30 - 45
    const distance = 70 + i * 12
    const x = Math.cos((angle * Math.PI) / 180) * distance
    const y = Math.sin((angle * Math.PI) / 180) * distance
    const triggerProgress = milestone.trigger / Math.abs(range)
    const delay = 350 + triggerProgress * 800
    return { x, y, delay }
  }

  return (
    <div
      className={styles['pf-tfx-combo-container']}
      data-animation-id="text-effects__combo-counter"
      style={
        {
          ...(numberColor !== undefined
            ? { '--text-effects-combo-counter-number-color': numberColor }
            : {}),
          ...(labelColor !== undefined
            ? { '--text-effects-combo-counter-label-color': labelColor }
            : {}),
          ...(bonusColor !== undefined
            ? { '--text-effects-combo-counter-bonus-color': bonusColor }
            : {}),
        } as React.CSSProperties
      }
    >
      <div className={styles['pf-tfx-combo-main']}>
        <div className={styles['pf-tfx-combo-number-wrapper']}>
          <div className={styles['pf-tfx-combo-number-container']}>
            <div className={styles['pf-tfx-combo-current-number']}>
              <span className={styles['pf-tfx-combo-digit']}>
                <span ref={numberRef}>{formatRef.current(from)}</span>
              </span>
            </div>

            {milestones.map((milestone, i) => {
              const { x, y, delay } = getParticleData(milestone, i)
              return (
                <div
                  key={i}
                  className={styles['pf-tfx-combo-particle-track']}
                  style={
                    {
                      '--particle-x': `${x}px`,
                      '--particle-y': `${y}px`,
                      animationDelay: `${delay}ms`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={styles['pf-tfx-combo-particle']}
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    +{formatRef.current(milestone.value)}
                  </span>
                </div>
              )
            })}
          </div>

          <div className={styles['pf-tfx-combo-hit-marker']}>×</div>
        </div>

        <div className={styles['pf-tfx-combo-text-wrapper']}>
          {Array.from(label).map((char, index) => (
            <span key={index} className={styles['pf-tfx-combo-letter']}>
              {char}
            </span>
          ))}
        </div>
      </div>

      {bonusText !== undefined && <div className={styles['pf-tfx-combo-bonus']}>{bonusText}</div>}
    </div>
  )
}

export const TextEffectsComboCounter = memo(TextEffectsComboCounterComponent)
