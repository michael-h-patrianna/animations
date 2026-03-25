/**
 * Milestone Unlock Progress Bar
 *
 * Progress bar with lock icons at milestone positions that unlock with
 * a wave animation as progress crosses their threshold. Icons toggle
 * between locked and unlocked states.
 *
 * @example
 * ```tsx
 * <ProgressBarsMilestoneUnlock
 *   progress={0.5}
 *   milestones={[{ position: 0.18 }, { position: 0.38 }, { position: 0.58 }, { position: 0.78 }, { position: 0.94 }]}
 *   label="Achievements"
 * />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--unlock-track-color`   — track/rail background
 * - `--unlock-fill-color`    — fill color
 * - `--unlock-label-color`   — header label color
 * - `--unlock-value-color`   — counter value color
 * - `--unlock-ring-color`    — milestone ring color
 *
 * Files to copy: this file + ProgressBarsMilestoneUnlock.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import { useMemo } from 'react'
import type { MilestoneProgressBarProps, MilestoneConfig } from '@/components/progress/progress-bars/SharedTypes'
import { useDemoProgress } from '@/components/progress/progress-bars/SharedDemoLoop'

interface MilestoneUnlockProps extends MilestoneProgressBarProps {
  /** Label text in header. Default: "Milestone Locks". */
  label?: string
  /** URL for locked milestone icon. Fallback: CSS lock shape. */
  lockedIcon?: string
  /** URL for unlocked milestone icon. Fallback: CSS unlock shape. */
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
  const isDemo = progress === undefined
  const demoDuration = 5500
  const displayProgress = useDemoProgress(progress, { duration: demoDuration, pause: 1500 })

  const activatedSet = useMemo(
    () => new Set(milestones.flatMap((ms, i) => (displayProgress >= ms.position ? [i] : []))),
    [displayProgress, milestones]
  )

  const unlocked = activatedSet.size

  return (
    <div
      className={`milestone-unlock-wrap${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__milestone-unlock"
    >
      <div className="milestone-unlock-meta">
        <span className="milestone-unlock-label">{label}</span>
        <span className="milestone-unlock-value">
          {unlocked}/{milestones.length}
        </span>
      </div>

      <div className="milestone-unlock-rail">
        <div className="milestone-unlock-rail-base" />
        <m.div
          className="milestone-unlock-rail-fill"
          initial={isDemo ? { width: '0%' } : false}
          animate={
            isDemo
              ? {
                  width: '100%',
                  transition: {
                    duration: demoDuration / 1000,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  },
                }
              : { width: `${displayProgress * 100}%` }
          }
          transition={isDemo ? undefined : { duration: 0.18, ease: [0.24, 0.78, 0.28, 0.98] }}
          style={{ animation: 'none' }}
        />

        {milestones.map((ms, i) => {
          const isUnlocked = activatedSet.has(i)

          return (
            <div
              key={i}
              className={`milestone-unlock-lock${isUnlocked ? ' open' : ' closed'}`}
              style={{ left: `${ms.position * 100}%` }}
            >
              <span className="milestone-unlock-lock-ring" />

              {lockedIcon !== undefined || unlockedIcon !== undefined ? (
                <m.img
                  className="milestone-unlock-lock-icon"
                  src={isUnlocked ? (unlockedIcon ?? lockedIcon) : lockedIcon}
                  alt=""
                  animate={
                    isUnlocked
                      ? { scale: [1, 1.07, 1], rotate: [0, -4, 4, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={isUnlocked ? { duration: 0.62, delay: i * 0.02 } : { duration: 0.18 }}
                  style={{ animation: 'none' }}
                />
              ) : (
                <m.span
                  className="milestone-unlock-lock-icon milestone-unlock-lock-icon--fallback"
                  animate={
                    isUnlocked
                      ? { scale: [1, 1.07, 1], rotate: [0, -4, 4, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={isUnlocked ? { duration: 0.62, delay: i * 0.02 } : { duration: 0.18 }}
                  style={{ animation: 'none' }}
                >
                  <LockFallback unlocked={isUnlocked} />
                </m.span>
              )}

              {isUnlocked && (
                <m.span
                  className="milestone-unlock-lock-wave"
                  initial={{ scale: 0.35, opacity: 0.72 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.66, ease: 'easeOut' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
