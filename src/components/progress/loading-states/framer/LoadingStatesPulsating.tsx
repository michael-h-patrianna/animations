/**
 * Two concentric rings expanding outward from center and fading — a pulsating radar effect.
 *
 * Copy-paste files: this file + LoadingStatesPulsating.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { PULSATING_COLOR } from '@/components/progress/loading-states/SharedDefaults'
import styles from './LoadingStatesPulsating.module.css'

interface LoadingStatesPulsatingProps {
  /** Overall diameter in px. */
  size?: number
  /** Ring color. */
  color?: string
  /** Ring border width in px. */
  ringWidth?: number
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_SIZE = 48
const DEFAULT_RING_WIDTH = 3
const DEFAULT_SPEED = 1
const RING_COUNT = 2
const STAGGER_DELAY = 0.45

function LoadingStatesPulsatingComponent({
  size = DEFAULT_SIZE,
  color = PULSATING_COLOR,
  ringWidth = DEFAULT_RING_WIDTH,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesPulsatingProps) {
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const cycleDuration = 1.8 / safeSpeed

  return (
    <div
      data-animation-id="loading-states__pulsating"
      className={
        className !== undefined
          ? `${styles['pf-pulsating-fm']} ${className}`
          : styles['pf-pulsating-fm']
      }
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <m.span
          key={i}
          className={styles['pf-pulsating-fm__ring']}
          style={{
            border: `${ringWidth}px solid ${color}`,
          }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={
            prefersReducedMotion
              ? { scale: 1, opacity: [0.7, 0.2, 0.7] }
              : { scale: [0.2, 1], opacity: [0.85, 0] }
          }
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: 'easeOut',
            delay: (i * STAGGER_DELAY) / safeSpeed,
          }}
        />
      ))}
    </div>
  )
}

export const LoadingStatesPulsating = memo(LoadingStatesPulsatingComponent)
