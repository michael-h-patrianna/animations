/**
 * Three dots bouncing upward in sequence — classic typing/processing indicator.
 *
 * Copy-paste files: this file + LoadingStatesDotsRise.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { DOTS_COLOR } from '../SharedDefaults'

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
const RISE_FACTOR = 1.33 // rise height relative to dot size

function LoadingStatesDotsRiseComponent({
  color = DOTS_COLOR,
  dotSize = DEFAULT_DOT_SIZE,
  gap = DEFAULT_GAP,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesDotsRiseProps) {
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = 0.6 / safeSpeed
  const riseHeight = Math.round(dotSize * RISE_FACTOR)

  return (
    <div
      data-animation-id="loading-states__dots-rise"
      className={className !== undefined ? `pf-dots-rise ${className}` : 'pf-dots-rise'}
      style={{ gap, animation: 'none' }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <m.span
          key={i}
          className="pf-dots-rise__dot"
          style={{
            width: dotSize,
            height: dotSize,
            background: color,
            animation: 'none',
          }}
          animate={
            prefersReducedMotion
              ? { opacity: [0.3, 1, 0.3] }
              : { y: [0, -riseHeight, 0] }
          }
          transition={{
            duration,
            repeat: Infinity,
            delay: i * 0.15 / safeSpeed,
          }}
        />
      ))}
    </div>
  )
}

export const LoadingStatesDotsRise = memo(LoadingStatesDotsRiseComponent)
