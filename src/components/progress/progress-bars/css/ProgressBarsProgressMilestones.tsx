/**
 * Milestone Markers Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsProgressMilestones.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import { useMemo } from 'react'
import type { MilestoneProgressBarProps, MilestoneConfig } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'
import './ProgressBarsProgressMilestones.css'

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
  const displayProgress = useDemoProgress(progress, { duration: 4000, pause: 1500 })

  const activatedSet = useMemo(
    () => new Set(milestones.filter((m) => displayProgress >= m.position).map((_, i) => i)),
    [displayProgress, milestones]
  )

  return (
    <div
      className={`pf-progress-milestones${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-milestones"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <div className="pf-progress-fill" style={{ transform: `scaleX(${displayProgress})` }} />
        </div>

        {milestones.map((ms, i) => {
          const isActive = activatedSet.has(i)
          return (
            <div
              key={i}
              className={`milestone-container${isActive ? ' is-active' : ''}`}
              style={{
                position: 'absolute',
                left: `${ms.position * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
              }}
            >
              <div className="milestone-marker" />
              {isActive && <div className="milestone-ring" />}
            </div>
          )
        })}

        <div className="milestone-labels">
          {milestones.map((ms, i) => (
            <span
              key={i}
              className={`milestone-label${activatedSet.has(i) ? ' is-active' : ''}`}
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
