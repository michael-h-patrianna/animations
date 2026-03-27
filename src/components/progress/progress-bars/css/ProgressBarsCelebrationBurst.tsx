/**
 * Celebration Burst Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsCelebrationBurst.css + ../SharedTypes.ts
 */
import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
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
  const displayProgress = progress ?? 0

  const activatedSet = useMemo(
    () => new Set(milestones.flatMap((ms, i) => (displayProgress >= ms.position ? [i] : []))),
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
              {isActive && (
                <>
                  <div className="burst-ring" />
                  <div className="burst-ring burst-ring--delayed" />
                  {[
                    { dx: 30, dy: 0 },
                    { dx: 0, dy: 30 },
                    { dx: -30, dy: 0 },
                    { dx: 0, dy: -30 },
                  ].map(({ dx, dy }, j) => (
                    <div
                      key={j}
                      className="burst-particle"
                      style={
                        {
                          '--particle-dx': `${dx}px`,
                          '--particle-dy': `${dy}px`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
