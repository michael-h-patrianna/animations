/**
 * Three dots that converge to a center point and scale down, then return.
 *
 * Copy-paste files: this file + LoadingStatesDotsPortal.module.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { DOTS_COLOR } from '@/components/progress/loading-states/SharedDefaults'
import styles from './LoadingStatesDotsPortal.module.css'

interface LoadingStatesDotsPortalProps {
  /** Dot color. */
  color?: string
  /** Dot diameter in px. */
  dotSize?: number
  /** Gap between dots in px (also determines travel distance). */
  gap?: number
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_DOT_SIZE = 12
const DEFAULT_GAP = 8
const DEFAULT_SPEED = 1

function LoadingStatesDotsPortalComponent({
  color = DOTS_COLOR,
  dotSize = DEFAULT_DOT_SIZE,
  gap = DEFAULT_GAP,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesDotsPortalProps) {
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = 1.2 / safeSpeed

  // Travel distance: gap + dotSize so dots converge to center
  const travel = gap + dotSize

  const ease = [0.4, 0, 0.2, 1] as const

  return (
    <div
      data-animation-id="loading-states__dots-portal"
      className={
        className !== undefined
          ? `${styles['pf-dots-portal-fm']} ${className}`
          : styles['pf-dots-portal-fm']
      }
      style={{ gap }}
      role="status"
      aria-label="Loading"
    >
      <m.span
        className={styles['pf-dots-portal-fm__dot']}
        style={{ width: dotSize, height: dotSize, background: color }}
        animate={
          prefersReducedMotion
            ? { opacity: [1, 0.5, 1] }
            : { x: [-travel, 0, -travel], scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }
        }
        transition={{ duration, ease, repeat: Infinity }}
      />
      <m.span
        className={styles['pf-dots-portal-fm__dot']}
        style={{ width: dotSize, height: dotSize, background: color }}
        animate={
          prefersReducedMotion
            ? { opacity: [1, 0.5, 1] }
            : { scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }
        }
        transition={{ duration, ease, repeat: Infinity }}
      />
      <m.span
        className={styles['pf-dots-portal-fm__dot']}
        style={{ width: dotSize, height: dotSize, background: color }}
        animate={
          prefersReducedMotion
            ? { opacity: [1, 0.5, 1] }
            : { x: [travel, 0, travel], scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }
        }
        transition={{ duration, ease, repeat: Infinity }}
      />
    </div>
  )
}

export const LoadingStatesDotsPortal = memo(LoadingStatesDotsPortalComponent)
