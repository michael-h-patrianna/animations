/**
 * Elastic Fill Progress Bar
 *
 * A progress bar that fills with playful elastic overshoot and squash physics.
 * In demo mode (no `progress` prop) it plays a one-shot fill to 70%.
 * In controlled mode it animates to the given value with elastic easing.
 *
 * @example
 * ```tsx
 * <ProgressBarsElasticFill progress={0.6} />
 * ```
 *
 * Styleable CSS custom properties (set on a wrapper or via `style`):
 * - `--elastic-fill-track-bg`      — track background (default: rgb(255 255 255 / 8%))
 * - `--elastic-fill-track-border`  — track border (default: rgb(255 255 255 / 5%))
 * - `--elastic-fill-track-shadow`  — track inset shadow (default: rgb(0 0 0 / 25%))
 * - `--elastic-fill-from`          — fill gradient start (default: #f59e0b)
 * - `--elastic-fill-to`            — fill gradient end (default: #fbbf24)
 * - `--elastic-fill-glow`          — fill outer glow (default: rgb(245 158 11 / 35%))
 * - `--elastic-fill-height`        — track height (default: 14px)
 * - `--elastic-fill-radius`        — border radius (default: 999px)
 *
 * Files to copy: this file + ProgressBarsElasticFill.css
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

const DEMO_TARGET = 0.7

export function ProgressBarsElasticFill({ progress, className, style }: ProgressBarProps) {
  const shouldReduceMotion = useReducedMotion()
  const isDemo = progress === undefined
  const target = progress ?? DEMO_TARGET
  const percent = Math.round(target * 100)

  const overshoot = Math.min(target * 1.1, 1)

  const animation = shouldReduceMotion
    ? {
        scaleX: target,
        scaleY: 1,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
      }
    : isDemo
      ? {
          scaleX: [0, overshoot, target],
          scaleY: [1, 0.9, 1],
          transition: {
            duration: 1.4,
            delay: 0.08,
            ease: [0.34, 1.56, 0.64, 1] as const,
            times: [0, 0.43, 1],
          },
        }
      : {
          scaleX: target,
          scaleY: 1,
          transition: {
            type: 'spring' as const,
            stiffness: 180,
            damping: 14,
          },
        }

  return (
    <div
      className={`pf-progress-elastic-fill${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__elastic-fill"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          <m.div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            initial={isDemo ? { scaleX: 0, scaleY: 1 } : false}
            animate={animation}
            style={{ transformOrigin: 'left center', animation: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
