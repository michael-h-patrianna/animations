/**
 * Timeline Progress (CSS variant)
 *
 * Files to copy: this file + ProgressBarsTimelineProgress.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '../SharedTypes'
import './ProgressBarsTimelineProgress.css'

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
  const isDemo = progress === undefined
  const activeSteps = isDemo ? steps : Math.ceil(progress * steps)

  return (
    <div
      className={`pf-timeline-progress${isDemo ? ' is-demo' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__timeline-progress"
    >
      <div className="pf-timeline-progress__track">
        {Array.from({ length: steps }, (_, index) => {
          const isActive = isDemo || index < activeSteps
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
                className={`pf-timeline-progress__step${isActive ? ' is-active' : ''}`}
                style={{
                  animationDelay: isDemo ? `${index * 260}ms` : undefined,
                }}
              >
                {index + 1}
              </div>
              {index < steps - 1 && (
                <div
                  className={`pf-timeline-progress__connector${isActive ? ' is-active' : ''}`}
                  style={{
                    animationDelay: isDemo ? `${index * 260}ms` : undefined,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
