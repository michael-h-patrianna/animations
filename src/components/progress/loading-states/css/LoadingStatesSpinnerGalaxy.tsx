/**
 * Spinning disc with two orbiting stars that pulse — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesSpinnerGalaxy.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import {
  SPINNER_GALAXY_COLOR,
  SPINNER_GALAXY_STARS,
} from '@/components/progress/loading-states/SharedDefaults'
import './LoadingStatesSpinnerGalaxy.css'

interface LoadingStatesSpinnerGalaxyProps {
  /** Overall diameter in px. */
  size?: number
  /** Ring border highlight color. */
  color?: string
  /** Colors for the two orbiting star dots [primary, secondary]. */
  starColors?: [string, string]
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_SIZE = 48
const DEFAULT_SPEED = 1

function LoadingStatesSpinnerGalaxyComponent({
  size = DEFAULT_SIZE,
  color = SPINNER_GALAXY_COLOR,
  starColors = SPINNER_GALAXY_STARS,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesSpinnerGalaxyProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const primaryStarSize = Math.max(4, Math.round(size * 0.167))
  const secondaryStarSize = Math.max(3, Math.round(size * 0.125))

  return (
    <div
      data-animation-id="loading-states__spinner-galaxy"
      className={className !== undefined ? `pf-spinner-galaxy ${className}` : 'pf-spinner-galaxy'}
      style={
        {
          '--pf-sg-size': `${size}px`,
          '--pf-sg-color': color,
          '--pf-sg-color-faded': `color-mix(in srgb, ${color} 16%, transparent)`,
          '--pf-sg-color-bg': `color-mix(in srgb, ${color} 10%, transparent)`,
          '--pf-sg-shadow': `0 0 ${Math.round(size * 0.42)}px color-mix(in srgb, ${color} 30%, transparent)`,
          '--pf-sg-star-1': starColors[0],
          '--pf-sg-star-1-size': `${primaryStarSize}px`,
          '--pf-sg-star-1-offset': `${Math.round(size * 0.167)}px`,
          '--pf-sg-star-2': starColors[1],
          '--pf-sg-star-2-size': `${secondaryStarSize}px`,
          '--pf-sg-star-2-offset': `${Math.round(size * 0.208)}px`,
          '--pf-sg-rotate-duration': `${2 / safeSpeed}s`,
          '--pf-sg-pulse-1-duration': `${1.5 / safeSpeed}s`,
          '--pf-sg-pulse-2-duration': `${1 / safeSpeed}s`,
          '--pf-sg-pulse-2-delay': `${0.3 / safeSpeed}s`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      <span className="pf-spinner-galaxy__star pf-spinner-galaxy__star--primary" />
      <span className="pf-spinner-galaxy__star pf-spinner-galaxy__star--secondary" />
    </div>
  )
}

export const LoadingStatesSpinnerGalaxy = memo(LoadingStatesSpinnerGalaxyComponent)
