/**
 * A colored border-top arc spinning continuously — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesSpinner.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { SPINNER_COLOR } from '@/components/progress/loading-states/SharedDefaults'
import './LoadingStatesSpinner.css'

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
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed

  return (
    <div
      data-animation-id="loading-states__spinner"
      className={className !== undefined ? `pf-spinner ${className}` : 'pf-spinner'}
      style={
        {
          '--pf-spinner-size': `${size}px`,
          '--pf-spinner-color': color,
          '--pf-spinner-thickness': `${thickness}px`,
          '--pf-spinner-duration': `${0.9 / safeSpeed}s`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    />
  )
}

export const LoadingStatesSpinner = memo(LoadingStatesSpinnerComponent)
