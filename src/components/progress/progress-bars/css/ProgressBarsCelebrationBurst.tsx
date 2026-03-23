/**
 * Celebration Burst Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsCelebrationBurst.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import { useMemo } from 'react'
import type { MilestoneProgressBarProps, MilestoneConfig } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'
import './ProgressBarsCelebrationBurst.css'

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0 },
  { position: 0.25 },
  { position: 0.5 },
  { position: 0.75 },
  { position: 1 },
]

export function ProgressBarsCelebrationBurst({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const displayProgress = useDemoProgress(progress, { duration: 4000, pause: 2000 })

  const activatedSet = useMemo(
    () => new Set(milestones.filter((ms) => displayProgress >= ms.position).map((_, i) => i)),
    [displayProgress, milestones]
  )

  return (
    <div
      className={`pf-celebration-burst${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__celebration-burst"
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
                width: '24px',
                height: '24px',
              }}
            >
              <div className="milestone-marker" />
              {isActive && <div className="burst-ring" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
