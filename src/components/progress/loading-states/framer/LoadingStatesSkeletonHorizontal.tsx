/**
 * Horizontal skeleton — even-width stacked shimmer lines.
 *
 * This is a composed layout using the Skeleton primitive. For custom layouts,
 * import Skeleton directly and compose your own.
 *
 * Copy-paste files: this file + ../SharedSkeleton.tsx + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import { memo } from 'react'

import { Skeleton } from '@/components/progress/loading-states/SharedSkeleton'
import type { SkeletonProps } from '@/components/progress/loading-states/SharedSkeleton'

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
  baseColor?: SkeletonProps['baseColor']
  /** Shimmer highlight color. */
  shimmerColor?: SkeletonProps['shimmerColor']
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
const DEFAULT_SPEED = 1
const DEFAULT_RADIUS = 4
const STAGGER_DELAY = 0.08

function LoadingStatesSkeletonHorizontalComponent({
  width = DEFAULT_WIDTH,
  lines = DEFAULT_LINES,
  lineHeight = DEFAULT_LINE_HEIGHT,
  gap = DEFAULT_GAP,
  baseColor,
  shimmerColor,
  speed = DEFAULT_SPEED,
  borderRadius = DEFAULT_RADIUS,
  className,
}: LoadingStatesSkeletonHorizontalProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed

  return (
    <div
      data-animation-id="loading-states__skeleton-horizontal"
      className={
        className !== undefined ? `pf-skeleton-horizontal ${className}` : 'pf-skeleton-horizontal'
      }
      style={{ width, gap, display: 'flex', flexDirection: 'column', animation: 'none' }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          width="100%"
          height={lineHeight}
          borderRadius={borderRadius}
          baseColor={baseColor}
          shimmerColor={shimmerColor}
          speed={speed}
          delay={(i * STAGGER_DELAY) / safeSpeed}
        />
      ))}
    </div>
  )
}

export const LoadingStatesSkeletonHorizontal = memo(LoadingStatesSkeletonHorizontalComponent)
