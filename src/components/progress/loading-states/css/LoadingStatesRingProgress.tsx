/**
 * SVG ring that continuously fills and empties — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesRingProgress.module.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { RING_PROGRESS_COLOR } from '@/components/progress/loading-states/SharedDefaults'
import styles from './LoadingStatesRingProgress.module.css'

interface LoadingStatesRingProgressProps {
  /** Ring diameter in px. */
  size?: number
  /** Progress stroke color. */
  color?: string
  /** Background track color. Defaults to color at 20% opacity. */
  trackColor?: string
  /** Stroke thickness in px. */
  thickness?: number
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_SIZE = 60
const DEFAULT_THICKNESS = 4
const DEFAULT_SPEED = 1

function LoadingStatesRingProgressComponent({
  size = DEFAULT_SIZE,
  color = RING_PROGRESS_COLOR,
  trackColor,
  thickness = DEFAULT_THICKNESS,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesRingProgressProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const radius = (size - thickness) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const resolvedTrackColor = trackColor ?? `color-mix(in srgb, ${color} 20%, transparent)`

  return (
    <div
      data-animation-id="loading-states__ring-progress"
      className={
        className !== undefined
          ? `${styles['pf-ring-progress']} ${className}`
          : styles['pf-ring-progress']
      }
      style={
        {
          '--pf-rp-size': `${size}px`,
          '--pf-rp-circumference': `${circumference}`,
          '--pf-rp-duration': `${2 / safeSpeed}s`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className={styles['pf-ring-progress__svg']}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={resolvedTrackColor}
          strokeWidth={thickness}
        />
        <circle
          className={styles['pf-ring-progress__stroke']}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference}`}
        />
      </svg>
    </div>
  )
}

export const LoadingStatesRingProgress = memo(LoadingStatesRingProgressComponent)
