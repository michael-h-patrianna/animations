/**
 * Timeline Progress
 *
 * Step-by-step timeline where numbered step circles and connectors
 * reveal with staggered pop animations. In demo mode plays the full
 * stagger sequence. In controlled mode fills steps proportional to
 * the given progress value.
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
  const isDemo = progress === undefined
  const activeSteps = isDemo ? steps : Math.ceil(progress * steps)

  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.26, delayChildren: 0 } },
  }

  const stepVariants = {
    initial: { scale: 0.9, opacity: 0.3 },
    animate: {
      scale: [0.9, 1.06, 1],
      opacity: [0.3, 1, 1],
      transition: { duration: 0.46, ease: [0.34, 1.56, 0.64, 1] as const },
    },
  }

  const connectorVariants = {
    initial: { scaleX: 0, opacity: 0.3 },
    animate: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  return (
    <m.div
      className={`pf-timeline-progress${className ? ` ${className}` : ''}`}
      style={style}
      variants={isDemo ? containerVariants : undefined}
      initial={isDemo ? 'initial' : undefined}
      animate={isDemo ? 'animate' : undefined}
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
              <m.div
                className="pf-timeline-progress__step"
                variants={isDemo ? stepVariants : undefined}
                animate={
                  !isDemo ? { scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.3 } : undefined
                }
                transition={!isDemo ? { duration: 0.3 } : undefined}
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
                  variants={isDemo ? connectorVariants : undefined}
                  animate={
                    !isDemo ? { scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0.3 } : undefined
                  }
                  transition={!isDemo ? { duration: 0.3 } : undefined}
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
