/**
 * Timeline Progress (CSS variant)
 *
 * Files to copy: this file + ProgressBarsTimelineProgress.module.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsTimelineProgress.module.css'

interface TimelineProps extends ProgressBarProps {
  /** Number of timeline steps. Default: 4. */
  steps?: number
}

export function ProgressBarsTimelineProgress({
  progress,
  steps = 4,
  className,
  style,
}: TimelineProps) {
  const activeSteps = Math.ceil((progress ?? 0) * steps)

  return (
    <div
      className={`${styles['pf-timeline-progress']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__timeline-progress"
    >
      <div
        className={styles['pf-timeline-progress__track']}
        role="progressbar"
        aria-valuenow={Math.round((progress ?? 0) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: steps }, (_, index) => {
          const isActive = index < activeSteps
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: index === steps - 1 ? 'none' : '1',
              }}
            >
              <div
                className={`${styles['pf-timeline-progress__step']}${isActive ? ` ${styles['is-active']}` : ''}`}
              >
                {index + 1}
              </div>
              {index < steps - 1 && (
                <div
                  className={`${styles['pf-timeline-progress__connector']}${isActive ? ` ${styles['is-active']}` : ''}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
