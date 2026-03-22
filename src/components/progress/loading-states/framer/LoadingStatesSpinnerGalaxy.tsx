/**
 * Spinning disc with two orbiting stars that pulse in scale and opacity.
 *
 * Copy-paste files: this file + LoadingStatesSpinnerGalaxy.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion, easeInOut } from 'motion/react'
import { memo } from 'react'

import {
  SPINNER_GALAXY_COLOR,
  SPINNER_GALAXY_STARS,
} from '../SharedDefaults'

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
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const rotateDuration = 2 / safeSpeed
  const primaryPulseDuration = 1.5 / safeSpeed
  const secondaryPulseDuration = 1 / safeSpeed

  const borderFaded = `color-mix(in srgb, ${color} 16%, transparent)`
  const bgGradient = `linear-gradient(160deg, color-mix(in srgb, ${color} 10%, transparent) 0%, transparent 70%)`
  const shadow = `0 0 ${Math.round(size * 0.42)}px color-mix(in srgb, ${color} 30%, transparent)`

  const primaryStarSize = Math.max(4, Math.round(size * 0.167))
  const secondaryStarSize = Math.max(3, Math.round(size * 0.125))
  const primaryOffset = Math.round(size * 0.167)
  const secondaryOffset = Math.round(size * 0.208)

  return (
    <m.div
      data-animation-id="loading-states__spinner-galaxy"
      className={className !== undefined ? `pf-spinner-galaxy ${className}` : 'pf-spinner-galaxy'}
      style={{
        width: size,
        height: size,
        background: bgGradient,
        border: `2px solid ${borderFaded}`,
        borderTopColor: color,
        ['--pf-sg-glow' as string]: shadow,
        animation: 'none',
      }}
      animate={prefersReducedMotion ? undefined : { rotate: 360 }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: rotateDuration, repeat: Infinity, ease: 'linear' as const }
      }
      role="status"
      aria-label="Loading"
    >
      <m.span
        className="pf-spinner-galaxy__star"
        style={{
          width: primaryStarSize,
          height: primaryStarSize,
          background: starColors[0],
          top: primaryOffset,
          left: primaryOffset,
          animation: 'none',
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: primaryPulseDuration, repeat: Infinity, ease: easeInOut }
        }
      />
      <m.span
        className="pf-spinner-galaxy__star"
        style={{
          width: secondaryStarSize,
          height: secondaryStarSize,
          background: starColors[1],
          bottom: secondaryOffset,
          right: secondaryOffset,
          animation: 'none',
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: secondaryPulseDuration, repeat: Infinity, ease: easeInOut, delay: 0.3 / safeSpeed }
        }
      />
    </m.div>
  )
}

export const LoadingStatesSpinnerGalaxy = memo(LoadingStatesSpinnerGalaxyComponent)
