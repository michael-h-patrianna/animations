/**
 * Circular Dash Progress (CSS variant)
 *
 * Files to copy: this file + ProgressBarsCircularDash.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import { useDemoProgress } from '@/components/progress/progress-bars/SharedDemoLoop'
import './ProgressBarsCircularDash.css'

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
      className={`circular-dash-container-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__circular-dash"
    >
      <div className="circular-dash-wrapper-css">
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className="circular-dash-segment-container-css"
            style={{ transform: `rotate(${(i / segments) * 360}deg)` }}
          >
            <div
              className="circular-dash-pill-css"
              style={{
                opacity: i < activeSegments ? 1 : 0.2,
                backgroundColor:
                  i < activeSegments
                    ? 'var(--circular-dash-active)'
                    : 'var(--circular-dash-inactive)',
              }}
            />
          </div>
        ))}
        <div className="circular-dash-center-css">{percent}%</div>
      </div>
    </div>
  )
}
