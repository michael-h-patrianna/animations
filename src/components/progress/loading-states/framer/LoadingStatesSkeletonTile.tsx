/**
 * Tile skeleton — grid of shimmer rectangles for image or dashboard loading.
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
import styles from './LoadingStatesSkeletonTile.module.css'

interface LoadingStatesSkeletonTileProps {
  /** Overall width in px. */
  width?: number
  /** Number of grid columns. */
  columns?: number
  /** Number of grid rows. */
  rows?: number
  /** Height of each tile in px. */
  tileHeight?: number
  /** Gap between tiles in px. */
  gap?: number
  /** Skeleton base fill color. */
  baseColor?: SkeletonProps['baseColor']
  /** Shimmer highlight color. */
  shimmerColor?: SkeletonProps['shimmerColor']
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Corner radius for each tile in px. */
  borderRadius?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_WIDTH = 200
const DEFAULT_COLUMNS = 3
const DEFAULT_ROWS = 2
const DEFAULT_TILE_HEIGHT = 40
const DEFAULT_GAP = 8
const DEFAULT_SPEED = 1
const DEFAULT_RADIUS = 4
const STAGGER_DELAY = 0.08

function LoadingStatesSkeletonTileComponent({
  width = DEFAULT_WIDTH,
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  tileHeight = DEFAULT_TILE_HEIGHT,
  gap = DEFAULT_GAP,
  baseColor,
  shimmerColor,
  speed = DEFAULT_SPEED,
  borderRadius = DEFAULT_RADIUS,
  className,
}: LoadingStatesSkeletonTileProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const totalTiles = columns * rows

  return (
    <div
      data-animation-id="loading-states__skeleton-tile"
      className={
        className !== undefined
          ? `${styles['pf-skeleton-tile-fm']} ${className}`
          : styles['pf-skeleton-tile-fm']
      }
      style={
        {
          width,
          gap,
          '--pf-skeleton-tile-cols': `repeat(${columns}, 1fr)`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: totalTiles }, (_, i) => (
        <Skeleton
          key={i}
          width="100%"
          height={tileHeight}
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

export const LoadingStatesSkeletonTile = memo(LoadingStatesSkeletonTileComponent)
