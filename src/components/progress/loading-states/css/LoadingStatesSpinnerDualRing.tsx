/**
 * Two concentric rings spinning in opposite directions — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesSpinnerDualRing.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import {
  SPINNER_DUAL_RING_COLOR,
  SPINNER_DUAL_RING_SECONDARY,
} from '../SharedDefaults'
import './LoadingStatesSpinnerDualRing.css'

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
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed

  return (
    <div
      data-animation-id="loading-states__spinner-dual-ring"
      className={className !== undefined ? `pf-spinner-dual-ring ${className}` : 'pf-spinner-dual-ring'}
      style={{
        '--pf-sdr-size': `${size}px`,
        '--pf-sdr-color': color,
        '--pf-sdr-color-faded': `color-mix(in srgb, ${color} 16%, transparent)`,
        '--pf-sdr-secondary': secondaryColor,
        '--pf-sdr-secondary-faded': `color-mix(in srgb, ${secondaryColor} 20%, transparent)`,
        '--pf-sdr-thickness': `${thickness}px`,
        '--pf-sdr-inner-thickness': `${Math.max(1, Math.round(thickness * 0.75))}px`,
        '--pf-sdr-inner-inset': `${Math.round(thickness / 2)}px`,
        '--pf-sdr-outer-duration': `${1 / safeSpeed}s`,
        '--pf-sdr-inner-duration': `${1.2 / safeSpeed}s`,
      } as React.CSSProperties}
      role="status"
      aria-label="Loading"
    >
      <div className="pf-spinner-dual-ring__outer" />
      <div className="pf-spinner-dual-ring__inner" />
    </div>
  )
}

export const LoadingStatesSpinnerDualRing = memo(LoadingStatesSpinnerDualRingComponent)
