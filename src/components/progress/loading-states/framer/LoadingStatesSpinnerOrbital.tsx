/**
 * A glowing satellite dot orbiting a dashed ring.
 *
 * Copy-paste files: this file + LoadingStatesSpinnerOrbital.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { SPINNER_ORBITAL_COLOR } from '../SharedDefaults'

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
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const orbitDuration = 1.2 / safeSpeed
  const ringFadeDuration = 2 / safeSpeed

  const satelliteSize = Math.max(6, Math.round(size * 0.25))
  const ringInset = Math.round(size * 0.167)
  const ringColor = `color-mix(in srgb, ${color} 40%, transparent)`
  const glowShadow = `0 0 ${Math.round(satelliteSize * 0.83)}px color-mix(in srgb, ${color} 80%, transparent)`

  // Transform origin: satellite rotates around the center of the container.
  // Satellite sits at the top center, so origin is offset by half the container height.
  const originY = size / 2 - satelliteSize / 2 + (satelliteSize / 2)

  return (
    <div
      data-animation-id="loading-states__spinner-orbital"
      className={className !== undefined ? `pf-spinner-orbital ${className}` : 'pf-spinner-orbital'}
      style={{
        width: size,
        height: size,
        animation: 'none',
      }}
      role="status"
      aria-label="Loading"
    >
      <m.span
        className="pf-spinner-orbital__satellite"
        style={{
          width: satelliteSize,
          height: satelliteSize,
          background: color,
          top: -Math.round(satelliteSize * 0.167),
          left: (size - satelliteSize) / 2,
          ['--pf-so-glow' as string]: glowShadow,
          transformOrigin: `${satelliteSize / 2}px ${originY}px`,
          animation: 'none',
        }}
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: orbitDuration, repeat: Infinity, ease: 'linear' as const }
        }
      />
      <m.span
        className="pf-spinner-orbital__ring"
        style={{
          inset: ringInset,
          border: `2px dashed ${ringColor}`,
          animation: 'none',
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { rotate: -360, opacity: [0.3, 0.8, 0.3] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: ringFadeDuration, repeat: Infinity, ease: 'linear' as const }
        }
      />
    </div>
  )
}

export const LoadingStatesSpinnerOrbital = memo(LoadingStatesSpinnerOrbitalComponent)
