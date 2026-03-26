/**
 * Two concentric rings spinning in opposite directions.
 *
 * Copy-paste files: this file + LoadingStatesSpinnerDualRing.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import {
  SPINNER_DUAL_RING_COLOR,
  SPINNER_DUAL_RING_SECONDARY,
} from '@/components/progress/loading-states/SharedDefaults'

interface LoadingStatesSpinnerDualRingProps {
  /** Overall diameter in px. */
  size?: number
  /** Outer ring highlight color. */
  color?: string
  /** Inner ring highlight color. */
  secondaryColor?: string
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Border thickness of the outer ring in px. Inner ring scales to 75%. */
  thickness?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_SIZE = 48
const DEFAULT_SPEED = 1
const DEFAULT_THICKNESS = 4

function LoadingStatesSpinnerDualRingComponent({
  size = DEFAULT_SIZE,
  color = SPINNER_DUAL_RING_COLOR,
  secondaryColor = SPINNER_DUAL_RING_SECONDARY,
  speed = DEFAULT_SPEED,
  thickness = DEFAULT_THICKNESS,
  className,
}: LoadingStatesSpinnerDualRingProps) {
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const outerDuration = 1 / safeSpeed
  const innerDuration = 1.2 / safeSpeed

  const innerThickness = Math.max(1, Math.round(thickness * 0.75))
  const innerInset = Math.round(thickness / 2)
  const innerSize = size - innerInset * 2 - innerThickness

  const colorFaded = `color-mix(in srgb, ${color} 16%, transparent)`
  const secondaryFaded = `color-mix(in srgb, ${secondaryColor} 20%, transparent)`

  return (
    <div
      data-animation-id="loading-states__spinner-dual-ring"
      className={
        className !== undefined ? `pf-spinner-dual-ring ${className}` : 'pf-spinner-dual-ring'
      }
      style={{
        width: size,
        height: size,
        animation: 'none',
      }}
      role="status"
      aria-label="Loading"
    >
      <m.span
        className="pf-spinner-dual-ring__outer"
        style={{
          width: size,
          height: size,
          border: `${thickness}px solid ${colorFaded}`,
          borderTopColor: color,
          animation: 'none',
        }}
        animate={prefersReducedMotion ? { opacity: [1, 0.5, 1] } : { rotate: 360 }}
        transition={
          prefersReducedMotion
            ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }
            : { duration: outerDuration, repeat: Infinity, ease: 'linear' as const }
        }
      />
      <m.span
        className="pf-spinner-dual-ring__inner"
        style={{
          width: innerSize,
          height: innerSize,
          top: innerInset,
          left: innerInset,
          border: `${innerThickness}px solid ${secondaryFaded}`,
          borderBottomColor: secondaryColor,
          animation: 'none',
        }}
        animate={prefersReducedMotion ? { opacity: [1, 0.5, 1] } : { rotate: -360 }}
        transition={
          prefersReducedMotion
            ? { duration: 1.5, delay: 0.75, repeat: Infinity, ease: 'easeInOut' as const }
            : { duration: innerDuration, repeat: Infinity, ease: 'linear' as const }
        }
      />
    </div>
  )
}

export const LoadingStatesSpinnerDualRing = memo(LoadingStatesSpinnerDualRingComponent)
