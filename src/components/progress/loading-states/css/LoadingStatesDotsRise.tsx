/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Three dots bouncing upward in sequence — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesDotsRise.module.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { DOTS_COLOR } from '@/components/progress/loading-states/SharedDefaults'
import styles from './LoadingStatesDotsRise.module.css'

interface LoadingStatesDotsRiseProps {
  /** Dot color. */
  color?: string
  /** Dot diameter in px. */
  dotSize?: number
  /** Gap between dots in px. */
  gap?: number
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_DOT_SIZE = 12
const DEFAULT_GAP = 8
const DEFAULT_SPEED = 1
const DOT_COUNT = 3
const RISE_FACTOR = 1.33

function LoadingStatesDotsRiseComponent({
  color = DOTS_COLOR,
  dotSize = DEFAULT_DOT_SIZE,
  gap = DEFAULT_GAP,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesDotsRiseProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = 1 / safeSpeed
  const riseHeight = Math.round(dotSize * RISE_FACTOR)

  return (
    <div
      data-animation-id="loading-states__dots-rise"
      className={
        className !== undefined ? `${styles['pf-dots-rise']} ${className}` : styles['pf-dots-rise']
      }
      style={
        {
          '--pf-dr-dot-size': `${dotSize}px`,
          '--pf-dr-color': color,
          '--pf-dr-gap': `${gap}px`,
          '--pf-dr-duration': `${duration}s`,
          '--pf-dr-rise': `${riseHeight}px`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <span
          key={i}
          className={styles['pf-dots-rise__dot']}
          style={{ animationDelay: `${(i * 0.15) / safeSpeed}s` }}
        />
      ))}
    </div>
  )
}

export const LoadingStatesDotsRise = memo(LoadingStatesDotsRiseComponent)
