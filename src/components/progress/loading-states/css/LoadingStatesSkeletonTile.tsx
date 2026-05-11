/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Tile skeleton — grid of shimmer rectangles — CSS variant.
 *
 * Uses the .pf-skeleton class from shared.css. For custom layouts, just add
 * .pf-skeleton to any element with explicit width/height.
 *
 * Copy-paste files: this file + LoadingStatesSkeletonTile.module.css + ../shared.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import {
  SKELETON_BASE_COLOR,
  SKELETON_SHIMMER_COLOR,
} from '@/components/progress/loading-states/SharedDefaults'
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
  baseColor?: string
  /** Shimmer highlight color. */
  shimmerColor?: string
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
const DEFAULT_BASE = SKELETON_BASE_COLOR
const DEFAULT_SHIMMER = SKELETON_SHIMMER_COLOR
const DEFAULT_SPEED = 1
const DEFAULT_RADIUS = 4
const STAGGER_DELAY = 0.08

function LoadingStatesSkeletonTileComponent({
  width = DEFAULT_WIDTH,
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  tileHeight = DEFAULT_TILE_HEIGHT,
  gap = DEFAULT_GAP,
  baseColor = DEFAULT_BASE,
  shimmerColor = DEFAULT_SHIMMER,
  speed = DEFAULT_SPEED,
  borderRadius = DEFAULT_RADIUS,
  className,
}: LoadingStatesSkeletonTileProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const totalTiles = columns * rows
  const duration = 1.4 / safeSpeed

  const vars = {
    '--pf-skeleton-base': baseColor,
    '--pf-skeleton-shimmer': shimmerColor,
    '--pf-skeleton-radius': `${borderRadius}px`,
    '--pf-skeleton-duration': `${duration}s`,
  } as React.CSSProperties

  return (
    <div
      data-animation-id="loading-states__skeleton-tile"
      className={
        className !== undefined
          ? `${styles['pf-skeleton-tile']} ${className}`
          : styles['pf-skeleton-tile']
      }
      style={{ ...vars, width, gap, gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: totalTiles }, (_, i) => (
        <div
          key={i}
          className={styles['pf-skeleton']}
          style={{
            width: '100%',
            height: tileHeight,
            animationDelay: `${(i * STAGGER_DELAY) / safeSpeed}s`,
          }}
        />
      ))}
    </div>
  )
}

export const LoadingStatesSkeletonTile = memo(LoadingStatesSkeletonTileComponent)
