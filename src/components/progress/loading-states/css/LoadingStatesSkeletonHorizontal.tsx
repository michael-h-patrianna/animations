/**
 * Horizontal skeleton — even-width stacked shimmer lines — CSS variant.
 *
 * Uses the .pf-skeleton class from shared.css. For custom layouts, just add
 * .pf-skeleton to any element with explicit width/height.
 *
 * Copy-paste files: this file + LoadingStatesSkeletonHorizontal.css + ../shared.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import {
  SKELETON_BASE_COLOR,
  SKELETON_SHIMMER_COLOR,
} from '@/components/progress/loading-states/SharedDefaults'
import './LoadingStatesSkeletonHorizontal.css'

interface LoadingStatesSkeletonHorizontalProps {
  /** Overall width in px. */
  width?: number
  /** Number of lines. */
  lines?: number
  /** Height of each line in px. */
  lineHeight?: number
  /** Gap between lines in px. */
  gap?: number
  /** Skeleton base fill color. */
  baseColor?: string
  /** Shimmer highlight color. */
  shimmerColor?: string
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Corner radius for each line in px. */
  borderRadius?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_WIDTH = 200
const DEFAULT_LINES = 6
const DEFAULT_LINE_HEIGHT = 12
const DEFAULT_GAP = 8
const DEFAULT_BASE = SKELETON_BASE_COLOR
const DEFAULT_SHIMMER = SKELETON_SHIMMER_COLOR
const DEFAULT_SPEED = 1
const DEFAULT_RADIUS = 4
const STAGGER_DELAY = 0.08

function LoadingStatesSkeletonHorizontalComponent({
  width = DEFAULT_WIDTH,
  lines = DEFAULT_LINES,
  lineHeight = DEFAULT_LINE_HEIGHT,
  gap = DEFAULT_GAP,
  baseColor = DEFAULT_BASE,
  shimmerColor = DEFAULT_SHIMMER,
  speed = DEFAULT_SPEED,
  borderRadius = DEFAULT_RADIUS,
  className,
}: LoadingStatesSkeletonHorizontalProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = 1.4 / safeSpeed

  const vars = {
    '--pf-skeleton-base': baseColor,
    '--pf-skeleton-shimmer': shimmerColor,
    '--pf-skeleton-radius': `${borderRadius}px`,
    '--pf-skeleton-duration': `${duration}s`,
  } as React.CSSProperties

  return (
    <div
      data-animation-id="loading-states__skeleton-horizontal"
      className={
        className !== undefined ? `pf-skeleton-horizontal ${className}` : 'pf-skeleton-horizontal'
      }
      style={{ ...vars, width, gap }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="pf-skeleton"
          style={{
            width: '100%',
            height: lineHeight,
            animationDelay: `${(i * STAGGER_DELAY) / safeSpeed}s`,
          }}
        />
      ))}
    </div>
  )
}

export const LoadingStatesSkeletonHorizontal = memo(LoadingStatesSkeletonHorizontalComponent)
