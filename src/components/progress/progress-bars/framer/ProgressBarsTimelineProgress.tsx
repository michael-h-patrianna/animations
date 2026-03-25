/**
 * Timeline Progress
 *
 * Step-by-step timeline where numbered step circles and connectors
 * activate proportional to the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsTimelineProgress progress={0.5} steps={4} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--timeline-step-bg`      — step circle background
 * - `--timeline-step-border`  — step circle border
 * - `--timeline-step-text`    — step number color
 * - `--timeline-connector`    — connector gradient
 *
 * Files to copy: this file + ProgressBarsTimelineProgress.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

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
    <m.div
      className={`pf-timeline-progress${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__timeline-progress"
    >
      <div className="pf-timeline-progress__track">
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
              <m.div
                className="pf-timeline-progress__step"
                animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'var(--timeline-step-bg, var(--pf-anim-dodger-blue-20))',
                  borderColor: 'var(--timeline-step-border, var(--pf-anim-dodger-blue-40))',
                  color: 'var(--timeline-step-text, var(--pf-white))',
                }}
              >
                {index + 1}
              </m.div>
              {index < steps - 1 && (
                <m.div
                  className="pf-timeline-progress__connector"
                  animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background:
                      'linear-gradient(90deg, var(--timeline-step-border, var(--pf-anim-dodger-blue-40)), var(--timeline-step-bg, var(--pf-anim-cyan-light-20)))',
                    transformOrigin: 'left',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </m.div>
  )
}
