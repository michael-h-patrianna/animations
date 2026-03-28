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
import styles from './ProgressBarsCelebrationBurst.module.css'

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
      className={`${styles['pf-celebration-burst']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__celebration-burst"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track']}>
          <div
            className={styles['pf-progress-fill']}
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
                width: '24px',
                height: '24px',
              }}
            >
              <div className={styles['milestone-marker']} />
              {isActive && (
                <>
                  <div className={styles['burst-ring']} />
                  <div className={`${styles['burst-ring']} ${styles['burst-ring--delayed']}`} />
                  {[
                    { dx: 30, dy: 0 },
                    { dx: 0, dy: 30 },
                    { dx: -30, dy: 0 },
                    { dx: 0, dy: -30 },
                  ].map(({ dx, dy }, j) => (
                    <div
                      key={j}
                      className={styles['burst-particle']}
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
