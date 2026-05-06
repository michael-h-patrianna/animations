/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Three concentric rings spinning at different speeds and directions — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesRingMulti.module.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { RING_MULTI_COLORS } from '@/components/progress/loading-states/SharedDefaults'
import styles from './LoadingStatesRingMulti.module.css'

interface LoadingStatesRingMultiProps {
  /** Outermost ring diameter in px. */
  size?: number
  /** Ring colors from inner to outer [inner, middle, outer]. */
  colors?: [string, string, string]
  /** Ring border thickness in px. */
  thickness?: number
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_SIZE = 60
const DEFAULT_THICKNESS = 3
const DEFAULT_SPEED = 1

function LoadingStatesRingMultiComponent({
  size = DEFAULT_SIZE,
  colors = RING_MULTI_COLORS,
  thickness = DEFAULT_THICKNESS,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesRingMultiProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const innerSize = Math.round(size * 0.667)
  const middleSize = Math.round(size * 0.833)

  return (
    <div
      data-animation-id="loading-states__ring-multi"
      className={
        className !== undefined
          ? `${styles['pf-ring-multi']} ${className}`
          : styles['pf-ring-multi']
      }
      style={
        {
          '--pf-rm-size': `${size}px`,
          '--pf-rm-thickness': `${thickness}px`,
          '--pf-rm-color-1': colors[0],
          '--pf-rm-color-2': colors[1],
          '--pf-rm-color-3': colors[2],
          '--pf-rm-inner-size': `${innerSize}px`,
          '--pf-rm-middle-size': `${middleSize}px`,
          '--pf-rm-duration-1': `${1.2 / safeSpeed}s`,
          '--pf-rm-duration-2': `${1.8 / safeSpeed}s`,
          '--pf-rm-duration-3': `${2.4 / safeSpeed}s`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      <span
        className={`${styles['pf-ring-multi__segment']} ${styles['pf-ring-multi__segment--inner']}`}
      />
      <span
        className={`${styles['pf-ring-multi__segment']} ${styles['pf-ring-multi__segment--middle']}`}
      />
      <span
        className={`${styles['pf-ring-multi__segment']} ${styles['pf-ring-multi__segment--outer']}`}
      />
    </div>
  )
}

export const LoadingStatesRingMulti = memo(LoadingStatesRingMultiComponent)
