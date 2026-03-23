/**
 * Skeleton shimmer primitive — renders one animated shimmer rectangle.
 *
 * Compose multiples to build any placeholder layout:
 *
 * ```tsx
 * <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 *   <Skeleton width={40} height={40} borderRadius="50%" />
 *   <Skeleton width="60%" height={18} />
 *   <Skeleton width="100%" height={12} />
 *   <Skeleton width="85%" height={12} />
 * </div>
 * ```
 *
 * Copy-paste files: this file + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { SKELETON_BASE_COLOR, SKELETON_SHIMMER_COLOR } from './SharedDefaults'

const DEFAULT_HEIGHT = 12
const DEFAULT_SPEED = 1
const DEFAULT_RADIUS = 4
const SHIMMER_DURATION_S = 1.5

/** Props for the Skeleton shimmer primitive. */
export interface SkeletonProps {
  /** Width — number (px) or CSS string ('100%', '60%'). Default '100%'. */
  width?: number | string
  /** Height in px. Default 12. */
  height?: number
  /** Border radius — number (px) or CSS string ('50%'). Default 4. */
  borderRadius?: number | string
  /** Base fill color. */
  baseColor?: string
  /** Shimmer highlight color. */
  shimmerColor?: string
  /** Animation speed multiplier (2 = twice as fast). Default 1. */
  speed?: number
  /** Stagger delay in seconds — offsets shimmer start for visual rhythm. Default 0. */
  delay?: number
  /** Additional CSS class. */
  className?: string
}

function SkeletonComponent({
  width = '100%',
  height = DEFAULT_HEIGHT,
  borderRadius = DEFAULT_RADIUS,
  baseColor = SKELETON_BASE_COLOR,
  shimmerColor = SKELETON_SHIMMER_COLOR,
  speed = DEFAULT_SPEED,
  delay = 0,
  className,
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = SHIMMER_DURATION_S / safeSpeed

  const gradient = `linear-gradient(90deg, ${baseColor} 0%, ${shimmerColor} 40%, ${baseColor} 100%)`

  return (
    <m.div
      className={className !== undefined ? `pf-skeleton ${className}` : 'pf-skeleton'}
      style={{
        width,
        height,
        borderRadius,
        background: gradient,
        backgroundSize: '200% 100%',
        animation: 'none',
      }}
      animate={prefersReducedMotion ? undefined : { backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration, ease: 'linear' as const, repeat: Infinity, delay }
      }
    />
  )
}

export const Skeleton = memo(SkeletonComponent)
