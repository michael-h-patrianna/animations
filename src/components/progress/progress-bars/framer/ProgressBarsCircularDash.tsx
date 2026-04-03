/**
 * Circular Dash Progress
 *
 * Circular segmented progress indicator with pill-shaped dashes arranged
 * in a ring. Center displays percentage. In demo mode cycles continuously.
 * In controlled mode fills segments proportional to progress.
 *
 * @example
 * ```tsx
 * <ProgressBarsCircularDash progress={0.75} segments={12} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--circular-dash-active`    — active segment color
 * - `--circular-dash-inactive`  — inactive segment color
 * - `--circular-dash-text`      — center text color
 * - `--circular-dash-size`      — ring diameter (default: 120px)
 *
 * Files to copy: this file + ProgressBarsCircularDash.module.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsCircularDash.module.css'

interface CircularDashProps extends ProgressBarProps {
  /** Number of dash segments in the ring. Default: 12. */
  segments?: number
}

export function ProgressBarsCircularDash({
  progress,
  segments = 12,
  className,
  style,
}: CircularDashProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayProgress = progress ?? 0
  const activeSegments = Math.floor(displayProgress * segments)
  const percent = Math.round(displayProgress * 100)

  return (
    <div
      className={`${styles['pf-circular-dash-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__circular-dash"
    >
      <div
        className={styles['pf-circular-dash-fm__wrapper']}
        role="progressbar"
        aria-label="Progress"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={styles['pf-circular-dash-fm__segment']}
            style={{ transform: `rotate(${(i / segments) * 360}deg)` }}
          >
            <m.div
              className={styles['pf-circular-dash-fm__pill']}
              animate={{
                opacity: i < activeSegments ? 1 : 0.2,
                backgroundColor:
                  i < activeSegments
                    ? 'var(--circular-dash-active)'
                    : 'var(--circular-dash-inactive)',
              }}
              transition={prefersReducedMotion ? { duration: 0.1 } : undefined}
            />
          </div>
        ))}
        <div className={styles['pf-circular-dash-fm__center']}>{percent}%</div>
      </div>
    </div>
  )
}
