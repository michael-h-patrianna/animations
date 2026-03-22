/**
 * Card skeleton with a title line and body lines — shimmer placeholder.
 *
 * This is a composed layout using the Skeleton primitive. For custom layouts,
 * import Skeleton directly and compose your own.
 *
 * Copy-paste files: this file + ../SharedSkeleton.tsx + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import { memo } from 'react'

import { Skeleton } from '../SharedSkeleton'
import type { SkeletonProps } from '../SharedSkeleton'

interface LoadingStatesSkeletonCardProps {
  /** Overall width in px. */
  width?: number
  /** Number of body lines (excluding title). */
  lines?: number
  /** Height of each body line in px. */
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
const DEFAULT_LINES = 3
const DEFAULT_LINE_HEIGHT = 12
const DEFAULT_GAP = 8
const DEFAULT_SPEED = 1
const DEFAULT_RADIUS = 4
const TITLE_HEIGHT_RATIO = 1.5
const TITLE_WIDTH_PERCENT = 60
const TITLE_MARGIN_RATIO = 1.5
const BODY_WIDTHS = [85, 75, 90, 80, 70, 95]
const STAGGER_DELAY = 0.08

function LoadingStatesSkeletonCardComponent({
  width = DEFAULT_WIDTH,
  lines = DEFAULT_LINES,
  lineHeight = DEFAULT_LINE_HEIGHT,
  gap = DEFAULT_GAP,
  baseColor,
  shimmerColor,
  speed = DEFAULT_SPEED,
  borderRadius = DEFAULT_RADIUS,
  className,
}: LoadingStatesSkeletonCardProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const titleHeight = Math.round(lineHeight * TITLE_HEIGHT_RATIO)
  const titleMargin = Math.round(gap * TITLE_MARGIN_RATIO)

  return (
    <div
      data-animation-id="loading-states__skeleton-card"
      className={className !== undefined ? `pf-skeleton-card ${className}` : 'pf-skeleton-card'}
      style={{ width, gap, display: 'flex', flexDirection: 'column', animation: 'none' }}
      role="status"
      aria-label="Loading"
    >
      <Skeleton
        width={`${TITLE_WIDTH_PERCENT}%`}
        height={titleHeight}
        borderRadius={borderRadius}
        baseColor={baseColor}
        shimmerColor={shimmerColor}
        speed={speed}
        className="pf-skeleton-card__line"
        delay={0}
      />
      <div style={{ height: titleMargin - gap }} />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          width={`${BODY_WIDTHS[i % BODY_WIDTHS.length]}%`}
          height={lineHeight}
          borderRadius={borderRadius}
          baseColor={baseColor}
          shimmerColor={shimmerColor}
          speed={speed}
          delay={(i + 1) * STAGGER_DELAY / safeSpeed}
          className="pf-skeleton-card__line"
        />
      ))}
    </div>
  )
}

export const LoadingStatesSkeletonCard = memo(LoadingStatesSkeletonCardComponent)
