/**
 * Circular Dash Progress (CSS variant)
 *
 * Files to copy: this file + ProgressBarsCircularDash.module.css + ../SharedTypes.ts
 */
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
  const displayProgress = progress ?? 0
  const activeSegments = Math.floor(displayProgress * segments)
  const percent = Math.round(displayProgress * 100)

  return (
    <div
      className={`${styles['pf-circular-dash-css']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__circular-dash"
    >
      <div
        className={styles['pf-circular-dash-css__wrapper']}
        role="progressbar"
        aria-label="Progress"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={styles['pf-circular-dash-css__segment']}
            style={{ transform: `rotate(${(i / segments) * 360}deg)` }}
          >
            <div
              className={styles['pf-circular-dash-css__pill']}
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
        <div className={styles['pf-circular-dash-css__center']}>{percent}%</div>
      </div>
    </div>
  )
}
