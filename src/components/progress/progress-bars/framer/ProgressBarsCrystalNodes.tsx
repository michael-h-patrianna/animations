/**
 * Crystal Nodes Progress Bar
 *
 * Progress bar with crystal-shaped milestone nodes that charge up with a
 * burst effect when the fill reaches their position.
 *
 * @example
 * ```tsx
 * <ProgressBarsCrystalNodes progress={0.6} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--crystal-track-color`    — track background
 * - `--crystal-fill-color`     — fill color
 * - `--crystal-active-color`   — active crystal color
 * - `--crystal-inactive-color` — inactive crystal color
 *
 * Files to copy: this file + ProgressBarsCrystalNodes.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import { useMemo } from 'react'
import type { MilestoneProgressBarProps, MilestoneConfig } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0.2 }, { position: 0.4 }, { position: 0.6 }, { position: 0.8 },
]

export function ProgressBarsCrystalNodes({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const displayProgress = useDemoProgress(progress, { duration: 4000, pause: 1200 })

  const activatedSet = useMemo(
    () => new Set(milestones.filter((ms) => displayProgress >= ms.position).map((_, i) => i)),
    [displayProgress, milestones]
  )

  return (
    <div
      className={`crystal-nodes-container${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__crystal-nodes"
    >
      <div className="crystal-track">
        <m.div
          className="crystal-track-fill"
          style={{ width: `${displayProgress * 100}%`, animation: 'none' }}
        />

        {milestones.map((ms, i) => {
          const isActive = activatedSet.has(i)
          return (
            <div key={i} className="crystal-wrapper" style={{ left: `${ms.position * 100}%` }}>
              <m.div
                className={`crystal-shape${isActive ? ' charged' : ''}`}
                animate={
                  isActive
                    ? {
                        backgroundColor: 'var(--crystal-active)',
                        scale: [1, 1.2, 1],
                      }
                    : {
                        backgroundColor: 'var(--crystal-inactive)',
                        scale: 1,
                      }
                }
                transition={{ duration: 0.4 }}
                style={{ animation: 'none' }}
              />
              {isActive && (
                <m.div
                  className="crystal-burst"
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
