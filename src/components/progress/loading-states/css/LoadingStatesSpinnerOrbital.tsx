/**
 * A glowing satellite dot orbiting a dashed ring — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesSpinnerOrbital.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { SPINNER_ORBITAL_COLOR } from '@/components/progress/loading-states/SharedDefaults'
import styles from './LoadingStatesSpinnerOrbital.module.css'

interface LoadingStatesSpinnerOrbitalProps {
  /** Diameter of the orbital path in px. */
  size?: number
  /** Satellite dot color and glow color. */
  color?: string
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_SIZE = 48
const DEFAULT_SPEED = 1

function LoadingStatesSpinnerOrbitalComponent({
  size = DEFAULT_SIZE,
  color = SPINNER_ORBITAL_COLOR,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesSpinnerOrbitalProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const satelliteSize = Math.max(6, Math.round(size * 0.25))
  const originY = size / 2

  return (
    <div
      data-animation-id="loading-states__spinner-orbital"
      className={
        className !== undefined
          ? `${styles['pf-spinner-orbital']} ${className}`
          : styles['pf-spinner-orbital']
      }
      style={
        {
          '--pf-so-size': `${size}px`,
          '--pf-so-color': color,
          '--pf-so-color-glow': `color-mix(in srgb, ${color} 80%, transparent)`,
          '--pf-so-ring-color': `color-mix(in srgb, ${color} 40%, transparent)`,
          '--pf-so-satellite-size': `${satelliteSize}px`,
          '--pf-so-satellite-top': `${-Math.round(satelliteSize * 0.167)}px`,
          '--pf-so-satellite-glow': `0 0 ${Math.round(satelliteSize * 0.83)}px color-mix(in srgb, ${color} 80%, transparent)`,
          '--pf-so-origin-x': `${satelliteSize / 2}px`,
          '--pf-so-origin-y': `${originY}px`,
          '--pf-so-ring-inset': `${Math.round(size * 0.167)}px`,
          '--pf-so-orbit-duration': `${1.2 / safeSpeed}s`,
          '--pf-so-ring-duration': `${2 / safeSpeed}s`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      <span className={styles['pf-spinner-orbital__satellite']} />
      <span className={styles['pf-spinner-orbital__ring']} />
    </div>
  )
}

export const LoadingStatesSpinnerOrbital = memo(LoadingStatesSpinnerOrbitalComponent)
