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
 * Files to copy: this file + ProgressBarsCircularDash.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

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
      className={`circular-dash-container${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__circular-dash"
    >
      <div className="circular-dash-wrapper">
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className="circular-dash-segment-container"
            style={{ transform: `rotate(${(i / segments) * 360}deg)` }}
          >
            <m.div
              className="circular-dash-pill"
              animate={{
                opacity: i < activeSegments ? 1 : 0.2,
                backgroundColor:
                  i < activeSegments
                    ? 'var(--circular-dash-active)'
                    : 'var(--circular-dash-inactive)',
              }}
              transition={prefersReducedMotion ? { duration: 0.1 } : undefined}
              style={{ animation: 'none' }}
            />
          </div>
        ))}
        <div className="circular-dash-center">{percent}%</div>
      </div>
    </div>
  )
}
