/**
 * Standalone: Copy this file + TextEffectsComboCounter.css into your app.
 * Runtime deps: react, motion
 * RN: Port with Moti — useMotionValue → useSharedValue, per-char stagger via delay.
 */

import * as m from 'motion/react-m'
import {
  animate,
  easeInOut,
  easeOut,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { memo, useEffect, useMemo, useRef } from 'react'

interface Milestone {
  trigger: number
  value: number
}

interface TextEffectsComboCounterProps {
  /** Starting value. @default 0 */
  from?: number
  /** Target combo count to animate to. @default 25 */
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
}: TextEffectsComboCounterProps) {
  const prefersReducedMotion = useReducedMotion()
  const formatRef = useRef(formatValue)
  formatRef.current = formatValue

  const range = to - from
  const milestones = useMemo(() => calculateMilestones(range, maxParticles), [range, maxParticles])

  const count = useMotionValue(from)
  const displayCount = useTransform(count, (latest) => formatRef.current(latest))

  useEffect(() => {
    count.set(from)
    const controls = animate(count, to, {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1] as const,
      delay: 0.35,
    })
    return controls.stop
  }, [count, from, to])

  return (
    <div
      className="pf-combo-fm"
      data-animation-id="text-effects__combo-counter"
      style={
        {
          ...(numberColor !== undefined ? { '--pf-combo-number-color': numberColor } : {}),
          ...(labelColor !== undefined ? { '--pf-combo-label-color': labelColor } : {}),
          ...(bonusColor !== undefined ? { '--pf-combo-bonus-color': bonusColor } : {}),
        } as React.CSSProperties
      }
    >
      <div className="pf-combo-fm__main">
        {/* Number counter with multiplier */}
        <m.div
          className="pf-combo-fm__number-wrapper"
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, rotate: -180 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { scale: [0, 1.2, 0.95, 1], rotate: [180, 10, -5, 0] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.3 }
              : {
                  duration: 0.5,
                  times: [0, 0.4, 0.7, 1],
                  ease: [0.25, 0.46, 0.45, 0.94] as const,
                }
          }
        >
          <div className="pf-combo-fm__number-container">
            <div className="pf-combo-fm__current-number">
              <m.span
                className="pf-combo-fm__digit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.25 }}
                style={{ display: 'inline-block', position: 'relative' }}
              >
                <m.span
                  className="pf-combo-fm__digit-pulse"
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.05, 1] }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 1.2, delay: 0.35, ease: easeInOut }
                  }
                >
                  {displayCount}
                </m.span>
              </m.span>
            </div>

            {/* Milestone particles — hidden in reduced motion */}
            {!prefersReducedMotion &&
              milestones.map((milestone, i) => {
                const angle = -90 + i * 30 - 45
                const distance = 70 + i * 12
                const xOffset = Math.cos((angle * Math.PI) / 180) * distance
                const yOffset = Math.sin((angle * Math.PI) / 180) * distance
                const triggerProgress = milestone.trigger / Math.abs(range)
                const adjustedDelay = triggerProgress * 0.8

                return (
                  <m.div
                    key={i}
                    className="pf-combo-fm__milestone-particle"
                    data-value={milestone.value}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      x: xOffset,
                      y: yOffset,
                      scale: [0, 1.4, 1, 0.5],
                    }}
                    transition={{ duration: 1, delay: 0.35 + adjustedDelay, ease: easeOut }}
                  >
                    <span className="pf-combo-fm__milestone-text">
                      +{formatValue(milestone.value)}
                    </span>
                    {milestone.value >= 10 && (
                      <span aria-hidden="true" className="pf-combo-fm__milestone-glow">
                        +{formatValue(milestone.value)}
                      </span>
                    )}
                  </m.div>
                )
              })}
          </div>

          {/* Hit multiplier */}
          <m.div
            className="pf-combo-fm__hit-marker"
            initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={
              prefersReducedMotion ? { opacity: 0.9 } : { scale: [0, 1.3, 1], opacity: [0, 1, 0.9] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.3, delay: 0.1 }
                : { duration: 0.3, delay: 0.15, ease: easeOut }
            }
          >
            ×
          </m.div>
        </m.div>

        {/* Label text with stagger */}
        <m.div
          className="pf-combo-fm__text-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {label.split('').map((char, index) => (
            <m.span
              key={index}
              className="pf-combo-fm__text-char"
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0, rotate: -180 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: [0, 1.2, 1], rotate: [180, -10, 0] }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.3, delay: 0.15 }
                  : {
                      duration: 0.4,
                      delay: 0.2 + index * 0.04,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    }
              }
            >
              {char}
            </m.span>
          ))}
        </m.div>
      </div>

      {/* Bonus text */}
      {bonusText !== undefined && (
        <m.div
          className="pf-combo-fm__bonus"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
          animate={
            prefersReducedMotion ? { opacity: 1 } : { opacity: [0, 1, 1], scale: [0.5, 1.1, 1] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.3, delay: 0.6 }
              : { duration: 0.4, delay: 1.6, times: [0, 0.6, 1], ease: easeOut }
          }
        >
          {bonusText}
        </m.div>
      )}
    </div>
  )
}

export const TextEffectsComboCounter = memo(TextEffectsComboCounterComponent)
