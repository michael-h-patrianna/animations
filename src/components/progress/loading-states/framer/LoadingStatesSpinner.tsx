/**
 * A colored border-top arc spinning continuously.
 *
 * Copy-paste files: this file + LoadingStatesSpinner.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { SPINNER_COLOR } from '@/components/progress/loading-states/SharedDefaults'

interface LoadingStatesSpinnerProps {
  /** Diameter of the spinner in px. */
  size?: number
  /** Arc color. */
  color?: string
  /** Ring thickness in px. */
  thickness?: number
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_SIZE = 40
const DEFAULT_THICKNESS = 4
const DEFAULT_SPEED = 1

function LoadingStatesSpinnerComponent({
  size = DEFAULT_SIZE,
  color = SPINNER_COLOR,
  thickness = DEFAULT_THICKNESS,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesSpinnerProps) {
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const duration = 0.9 / safeSpeed

  return (
    <m.div
      data-animation-id="loading-states__spinner"
      className={className !== undefined ? `pf-spinner ${className}` : 'pf-spinner'}
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid transparent`,
        borderTopColor: color,
        animation: 'none',
      }}
      animate={prefersReducedMotion ? { opacity: [1, 0.4, 1] } : { rotate: 360 }}
      transition={
        prefersReducedMotion
          ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }
          : { duration, repeat: Infinity, ease: 'linear' as const }
      }
      role="status"
      aria-label="Loading"
    />
  )
}

export const LoadingStatesSpinner = memo(LoadingStatesSpinnerComponent)
