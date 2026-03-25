/**
 * Milestone Unlock Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsMilestoneUnlock.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import { useMemo } from 'react'
import type { MilestoneProgressBarProps, MilestoneConfig } from '@/components/progress/progress-bars/SharedTypes'
import { useDemoProgress } from '@/components/progress/progress-bars/SharedDemoLoop'
import './ProgressBarsMilestoneUnlock.css'

interface MilestoneUnlockProps extends MilestoneProgressBarProps {
  label?: string
  lockedIcon?: string
  unlockedIcon?: string
}

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0.18 },
  { position: 0.38 },
  { position: 0.58 },
  { position: 0.78 },
  { position: 0.94 },
]

function LockFallback({ unlocked }: { unlocked: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d={unlocked ? 'M7 11V7a5 5 0 0 1 9.9-1' : 'M7 11V7a5 5 0 0 1 10 0v4'} />
    </svg>
  )
}

export function ProgressBarsMilestoneUnlock({
  progress,
  milestones = DEFAULT_MILESTONES,
  label = 'Milestone Locks',
  lockedIcon,
  unlockedIcon,
  className,
  style,
}: MilestoneUnlockProps) {
  const displayProgress = useDemoProgress(progress, { duration: 5500, pause: 1500 })

  const activatedSet = useMemo(
    () => new Set(milestones.flatMap((ms, i) => (displayProgress >= ms.position ? [i] : []))),
    [displayProgress, milestones]
  )

  return (
    <div
      className={`milestone-unlock-wrap-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__milestone-unlock"
    >
      <div className="milestone-unlock-meta-css">
        <span className="milestone-unlock-label-css">{label}</span>
        <span className="milestone-unlock-value-css">
          {activatedSet.size}/{milestones.length}
        </span>
      </div>

      <div className="milestone-unlock-rail-css">
        <div className="milestone-unlock-rail-base-css" />
        <div
          className="milestone-unlock-rail-fill-css"
          style={{ width: `${displayProgress * 100}%` }}
        />

        {milestones.map((ms, i) => {
          const isUnlocked = activatedSet.has(i)
          return (
            <div
              key={i}
              className={`milestone-unlock-lock-css${isUnlocked ? ' open' : ' closed'}`}
              style={{ left: `${ms.position * 100}%` }}
            >
              <span className="milestone-unlock-lock-ring-css" />

              {lockedIcon !== undefined || unlockedIcon !== undefined ? (
                <img
                  className={`milestone-unlock-lock-icon-css${isUnlocked ? ' open' : ' closed'}`}
                  src={isUnlocked ? (unlockedIcon ?? lockedIcon) : lockedIcon}
                  alt=""
                  style={{ animationDelay: `${i * 0.02}s` }}
                />
              ) : (
                <span
                  className={`milestone-unlock-lock-icon-css milestone-unlock-lock-icon--fallback${isUnlocked ? ' open' : ' closed'}`}
                >
                  <LockFallback unlocked={isUnlocked} />
                </span>
              )}

              {isUnlocked && <span className="milestone-unlock-lock-wave-css" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
