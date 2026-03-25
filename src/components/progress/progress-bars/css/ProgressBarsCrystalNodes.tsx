/**
 * Crystal Nodes Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsCrystalNodes.css + ../SharedTypes.ts
 */
import { useMemo } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
import './ProgressBarsCrystalNodes.css'

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0.2 },
  { position: 0.4 },
  { position: 0.6 },
  { position: 0.8 },
]

export function ProgressBarsCrystalNodes({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const displayProgress = (progress ?? 0)

  const activatedSet = useMemo(
    () => new Set(milestones.flatMap((ms, i) => (displayProgress >= ms.position ? [i] : []))),
    [displayProgress, milestones]
  )

  return (
    <div
      className={`crystal-nodes-container-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__crystal-nodes"
    >
      <div className="crystal-track-css">
        <div className="crystal-track-fill-css" style={{ width: `${displayProgress * 100}%` }} />

        {milestones.map((ms, i) => {
          const isActive = activatedSet.has(i)
          return (
            <div key={i} className="crystal-wrapper-css" style={{ left: `${ms.position * 100}%` }}>
              <div className={`crystal-shape-css${isActive ? ' charged' : ''}`} />
              {isActive && <div className="crystal-burst-css" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
