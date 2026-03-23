/**
 * Three dots that converge to a center point and scale down, then return — CSS variant.
 *
 * Copy-paste files: this file + LoadingStatesDotsPortal.css + ../SharedDefaults.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { DOTS_COLOR } from '../SharedDefaults'
import './LoadingStatesDotsPortal.css'

interface LoadingStatesDotsPortalProps {
  /** Dot color. */
  color?: string
  /** Dot diameter in px. */
  dotSize?: number
  /** Gap between dots in px (also determines travel distance). */
  gap?: number
  /** Animation speed multiplier (2 = twice as fast). */
  speed?: number
  /** Additional CSS class for the root element. */
  className?: string
}

const DEFAULT_DOT_SIZE = 12
const DEFAULT_GAP = 8
const DEFAULT_SPEED = 1

function LoadingStatesDotsPortalComponent({
  color = DOTS_COLOR,
  dotSize = DEFAULT_DOT_SIZE,
  gap = DEFAULT_GAP,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesDotsPortalProps) {
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed
  const travel = gap + dotSize

  return (
    <div
      data-animation-id="loading-states__dots-portal"
      className={className !== undefined ? `pf-dots-portal ${className}` : 'pf-dots-portal'}
      style={
        {
          '--pf-dp-dot-size': `${dotSize}px`,
          '--pf-dp-color': color,
          '--pf-dp-gap': `${gap}px`,
          '--pf-dp-duration': `${1.2 / safeSpeed}s`,
          '--pf-dp-travel': `${travel}px`,
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      <span className="pf-dots-portal__dot pf-dots-portal__dot--left" />
      <span className="pf-dots-portal__dot pf-dots-portal__dot--center" />
      <span className="pf-dots-portal__dot pf-dots-portal__dot--right" />
    </div>
  )
}

export const LoadingStatesDotsPortal = memo(LoadingStatesDotsPortalComponent)
