/**
 * Flag Plant Progress Bar
 *
 * Progress bar with checkpoint markers that "plant" with wave effects
 * as progress crosses their positions. Uses configurable marker icons
 * with an SVG flag fallback.
 *
 * @example
 * ```tsx
 * <ProgressBarsFlagPlant
 *   progress={0.6}
 *   label="Checkpoints"
 *   milestones={[{ position: 0.2 }, { position: 0.5 }, { position: 0.8 }]}
 * />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--flag-track-color`   — track background
 * - `--flag-fill-color`    — fill color
 * - `--flag-label-color`   — header label
 * - `--flag-value-color`   — counter value
 * - `--flag-accent`        — pulse wave color
 *
 * Files to copy: this file + ProgressBarsFlagPlant.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import { useMemo } from 'react'
import type { MilestoneProgressBarProps, MilestoneConfig } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'

interface FlagPlantProps extends MilestoneProgressBarProps {
  /** Label text. Default: "Checkpoint Planting". */
  label?: string
  /** URL for marker icon. Fallback: SVG flag. */
  markerIcon?: string
}

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0.16 }, { position: 0.34 }, { position: 0.52 }, { position: 0.70 }, { position: 0.88 },
]

function FlagFallback({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.45 }}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill={active ? 'currentColor' : 'none'} />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

export function ProgressBarsFlagPlant({
  progress,
  milestones = DEFAULT_MILESTONES,
  label = 'Checkpoint Planting',
  markerIcon,
  className,
  style,
}: FlagPlantProps) {
  const isDemo = progress === undefined
  const demoDuration = 5000
  const displayProgress = useDemoProgress(progress, { duration: demoDuration, pause: 1500 })

  const activatedSet = useMemo(
    () => new Set(milestones.filter((ms) => displayProgress >= ms.position).map((_, i) => i)),
    [displayProgress, milestones]
  )

  const planted = activatedSet.size

  return (
    <div
      className={`flag-plant-wrap${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__flag-plant"
    >
      <div className="flag-plant-meta">
        <span className="flag-plant-label">{label}</span>
        <span className="flag-plant-value">
          {planted}/{milestones.length}
        </span>
      </div>

      <div className="flag-plant-bar">
        <div className="flag-plant-bar-base" />
        <m.div
          className="flag-plant-bar-fill"
          initial={isDemo ? { width: '0%' } : false}
          animate={isDemo
            ? { width: '100%', transition: { duration: demoDuration / 1000, ease: 'linear', repeat: Infinity, repeatDelay: 1.5 } }
            : { width: `${displayProgress * 100}%` }
          }
          transition={isDemo ? undefined : { duration: 0.18, ease: [0.24, 0.78, 0.28, 0.98] }}
          style={{ animation: 'none' }}
        />

        {milestones.map((ms, i) => {
          const isPlanted = activatedSet.has(i)

          return (
            <div
              key={i}
              className={`flag-plant-site${isPlanted ? ' active' : ''}`}
              style={{ left: `${ms.position * 100}%` }}
            >
              {markerIcon !== undefined ? (
                <m.img
                  className="flag-plant-marker"
                  src={markerIcon}
                  alt=""
                  animate={
                    isPlanted
                      ? { opacity: 1, scale: [1, 1.06, 1], rotate: [0, 5, -3, 2, 0] }
                      : { opacity: 0.45, scale: 0.9, rotate: 0 }
                  }
                  transition={
                    isPlanted
                      ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }
                      : { duration: 0.2 }
                  }
                  style={{ animation: 'none' }}
                />
              ) : (
                <m.span
                  className="flag-plant-marker flag-plant-marker--fallback"
                  animate={
                    isPlanted
                      ? { opacity: 1, scale: [1, 1.06, 1], rotate: [0, 5, -3, 2, 0] }
                      : { opacity: 0.45, scale: 0.9, rotate: 0 }
                  }
                  transition={
                    isPlanted
                      ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }
                      : { duration: 0.2 }
                  }
                  style={{ animation: 'none' }}
                >
                  <FlagFallback active={isPlanted} />
                </m.span>
              )}

              {isPlanted && (
                <m.span
                  className="flag-plant-pulse"
                  initial={{ scale: 0.3, opacity: 0.74 }}
                  animate={{ scale: 1.65, opacity: 0 }}
                  transition={{ duration: 0.62, ease: 'easeOut' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
