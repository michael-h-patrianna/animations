/**
 * Milestone Markers Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsProgressMilestones.module.css + ../SharedTypes.ts
 */
import { useMemo } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsProgressMilestones.module.css'

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0, label: 'Start' },
  { position: 0.25, label: '25%' },
  { position: 0.5, label: '50%' },
  { position: 0.75, label: '75%' },
  { position: 1, label: '100%' },
]

export function ProgressBarsProgressMilestones({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const displayProgress = progress ?? 0

  const activatedSet = useMemo(
    () => new Set(milestones.flatMap((ms, i) => (displayProgress >= ms.position ? [i] : []))),
    [displayProgress, milestones]
  )

  return (
    <div
      className={`${styles['pf-progress-milestones']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-milestones"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track']}>
          <div
            className={styles['pf-progress-fill']}
            role="progressbar"
            aria-valuenow={Math.round(displayProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ transform: `scaleX(${displayProgress})` }}
          />
        </div>

        {milestones.map((ms, i) => {
          const isActive = activatedSet.has(i)
          return (
            <div
              key={i}
              className={`${styles['milestone-container']}${isActive ? ` ${styles['is-active']}` : ''}`}
              style={{
                position: 'absolute',
                left: `${ms.position * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
              }}
            >
              <div className={styles['milestone-marker']} />
              {isActive && <div className={styles['milestone-ring']} />}
            </div>
          )
        })}

        <div className={styles['milestone-labels']}>
          {milestones.map((ms, i) => (
            <span
              key={i}
              className={`${styles['milestone-label']}${activatedSet.has(i) ? ` ${styles['is-active']}` : ''}`}
              style={{ left: `${ms.position * 100}%` }}
            >
              {ms.label ?? `${Math.round(ms.position * 100)}%`}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
