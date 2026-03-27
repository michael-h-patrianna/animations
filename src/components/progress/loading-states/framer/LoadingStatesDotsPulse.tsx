/**
 * Three dots scaling up with a staggered opacity pulse — breathing indicator.
 *
 * Copy-paste files: this file + LoadingStatesDotsPulse.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { DOTS_COLOR } from '@/components/progress/loading-states/SharedDefaults'

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
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = 1.2 / safeSpeed

  return (
    <div
      data-animation-id="loading-states__dots-pulse"
      className={className !== undefined ? `pf-dots-pulse ${className}` : 'pf-dots-pulse'}
      style={{ gap, animation: 'none' }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <m.span
          key={i}
          className="pf-dots-pulse__dot"
          style={{
            width: dotSize,
            height: dotSize,
            background: color,
            animation: 'none',
          }}
          animate={
            prefersReducedMotion
              ? { opacity: [0.5, 1, 0.5] }
              : { scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }
          }
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: (i * 0.15) / safeSpeed,
          }}
        />
      ))}
    </div>
  )
}

export const LoadingStatesDotsPulse = memo(LoadingStatesDotsPulseComponent)
