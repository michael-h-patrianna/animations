/**
 * Two concentric rings expanding outward from center and fading — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesPulsating.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

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
const DEFAULT_SPEED = 1

function LoadingStatesPulsatingComponent({
  size = DEFAULT_SIZE,
  color = PULSATING_COLOR,
  ringWidth = 3,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesPulsatingProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed

  return (
    <div
      data-animation-id="loading-states__pulsating"
      className={
        className !== undefined ? `${styles['pf-pulsating']} ${className}` : styles['pf-pulsating']
      }
      style={
        {
          '--pf-pulsating-size': `${size}px`,
          '--pf-pulsating-color': color,
          '--pf-pulsating-ring-width': `${ringWidth}px`,
          '--pf-pulsating-duration': `${1.8 / safeSpeed}s`,
          '--pf-pulsating-delay': `${0.45 / safeSpeed}s`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    />
  )
}

export const LoadingStatesPulsating = memo(LoadingStatesPulsatingComponent)
