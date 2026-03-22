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
 * Files to copy: this file + ProgressBarsCircularDash.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import type { ProgressBarProps } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'

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
  const displayProgress = useDemoProgress(progress, { duration: 5000, pause: 800 })
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
                    ? 'var(--circular-dash-active, var(--pf-anim-blue-dark))'
                    : 'var(--circular-dash-inactive, var(--pf-anim-slate))',
              }}
              style={{ animation: 'none' }}
            />
          </div>
        ))}
        <div className="circular-dash-center">{percent}%</div>
      </div>
    </div>
  )
}
