/**
 * Three dots scaling up with a staggered opacity pulse — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesDotsPulse.module.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { DOTS_COLOR } from '@/components/progress/loading-states/SharedDefaults'
import styles from './LoadingStatesDotsPulse.module.css'

interface LoadingStatesDotsPulseProps {
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

function LoadingStatesDotsPulseComponent({
  color = DOTS_COLOR,
  dotSize = DEFAULT_DOT_SIZE,
  gap = DEFAULT_GAP,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesDotsPulseProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = 1.2 / safeSpeed

  return (
    <div
      data-animation-id="loading-states__dots-pulse"
      className={
        className !== undefined
          ? `${styles['pf-dots-pulse']} ${className}`
          : styles['pf-dots-pulse']
      }
      style={
        {
          '--pf-dp-dot-size': `${dotSize}px`,
          '--pf-dp-color': color,
          '--pf-dp-gap': `${gap}px`,
          '--pf-dp-duration': `${duration}s`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <span
          key={i}
          className={styles['pf-dots-pulse__dot']}
          style={{ animationDelay: `${(i * 0.15) / safeSpeed}s` }}
        />
      ))}
    </div>
  )
}

export const LoadingStatesDotsPulse = memo(LoadingStatesDotsPulseComponent)
