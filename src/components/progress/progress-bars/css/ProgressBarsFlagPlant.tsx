/**
 * Flag Plant Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsFlagPlant.css + ../SharedTypes.ts
 */
import { useMemo } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
import './ProgressBarsFlagPlant.css'

interface FlagPlantProps extends MilestoneProgressBarProps {
  label?: string
  markerIcon?: string
}

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0.16 },
  { position: 0.34 },
  { position: 0.52 },
  { position: 0.7 },
  { position: 0.88 },
]

function FlagFallback({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: active ? 1 : 0.45 }}
    >
      <path
        d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
        fill={active ? 'currentColor' : 'none'}
      />
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
  const displayProgress = (progress ?? 0)

  const activatedSet = useMemo(
    () => new Set(milestones.flatMap((ms, i) => (displayProgress >= ms.position ? [i] : []))),
    [displayProgress, milestones]
  )

  return (
    <div
      className={`flag-plant-wrap-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__flag-plant"
    >
      <div className="flag-plant-meta-css">
        <span className="flag-plant-label-css">{label}</span>
        <span className="flag-plant-value-css">
          {activatedSet.size}/{milestones.length}
        </span>
      </div>

      <div className="flag-plant-bar-css">
        <div className="flag-plant-bar-base-css" />
        <div className="flag-plant-bar-fill-css" style={{ width: `${displayProgress * 100}%` }} />

        {milestones.map((ms, i) => {
          const isPlanted = activatedSet.has(i)
          return (
            <div
              key={i}
              className={`flag-plant-site-css${isPlanted ? ' active' : ''}`}
              style={{ left: `${ms.position * 100}%` }}
            >
              {markerIcon !== undefined ? (
                <img
                  className={`flag-plant-marker-css${isPlanted ? ' active' : ''}`}
                  src={markerIcon}
                  alt=""
                  style={{ animationDelay: `${i * 0.04}s` }}
                />
              ) : (
                <span
                  className={`flag-plant-marker-css flag-plant-marker--fallback${isPlanted ? ' active' : ''}`}
                >
                  <FlagFallback active={isPlanted} />
                </span>
              )}

              {isPlanted && <span className="flag-plant-pulse-css" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
