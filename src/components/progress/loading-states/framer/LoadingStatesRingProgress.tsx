/**
 * SVG ring that continuously fills and empties — indeterminate circular progress.
 *
 * Copy-paste files: this file + LoadingStatesRingProgress.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { RING_PROGRESS_COLOR } from '../SharedDefaults'

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
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = 3 / safeSpeed

  const radius = (size - thickness) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const resolvedTrackColor = trackColor ?? `color-mix(in srgb, ${color} 20%, transparent)`

  return (
    <div
      data-animation-id="loading-states__ring-progress"
      className={className !== undefined ? `pf-ring-progress ${className}` : 'pf-ring-progress'}
      style={{ width: size, height: size, animation: 'none' }}
      role="status"
      aria-label="Loading"
    >
      {/* eslint-disable animation-rules/no-svg-in-motion -- ring progress requires SVG for strokeDashoffset animation; no equivalent in React Native without react-native-svg */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={resolvedTrackColor}
          strokeWidth={thickness}
        />
        <m.circle
          className="pf-ring-progress__stroke"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          style={{ animation: 'none' }}
          animate={
            prefersReducedMotion
              ? { strokeDashoffset: [circumference, circumference * 0.25] }
              : { strokeDashoffset: [circumference, 0, -circumference] }
          }
          transition={
            prefersReducedMotion
              ? { duration: duration / 2, ease: 'easeInOut' as const }
              : { duration, repeat: Infinity, ease: 'linear' as const, times: [0, 0.5, 1] }
          }
        />
      </svg>
      {/* eslint-enable animation-rules/no-svg-in-motion */}
    </div>
  )
}

export const LoadingStatesRingProgress = memo(LoadingStatesRingProgressComponent)
