/**
 * Three concentric rings spinning at different speeds and directions.
 *
 * Copy-paste files: this file + LoadingStatesRingMulti.css + ../SharedDefaults.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { RING_MULTI_COLORS } from '../SharedDefaults'

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

// Ring configs: size fraction of outer, rotation direction, base duration
const RING_CONFIGS = [
  { sizeFrac: 0.667, dir: 1, baseDuration: 1.2, opacity: 0.8 },
  { sizeFrac: 0.833, dir: -1, baseDuration: 1.8, opacity: 0.6 },
  { sizeFrac: 1, dir: 1, baseDuration: 2.4, opacity: 0.4 },
] as const

function LoadingStatesRingMultiComponent({
  size = DEFAULT_SIZE,
  colors = RING_MULTI_COLORS,
  thickness = DEFAULT_THICKNESS,
  speed = DEFAULT_SPEED,
  className,
}: LoadingStatesRingMultiProps) {
  const prefersReducedMotion = useReducedMotion()
  const safeSpeed = speed <= 0 ? DEFAULT_SPEED : speed

  return (
    <div
      data-animation-id="loading-states__ring-multi"
      className={className !== undefined ? `pf-ring-multi ${className}` : 'pf-ring-multi'}
      style={{ width: size, height: size, animation: 'none' }}
      role="status"
      aria-label="Loading"
    >
      {RING_CONFIGS.map((ring, i) => {
        const ringSize = Math.round(size * ring.sizeFrac)
        return (
          <m.span
            key={i}
            className="pf-ring-multi__segment"
            style={{
              width: ringSize,
              height: ringSize,
              border: `${thickness}px solid ${colors[i]}`,
              borderTopColor: 'transparent',
              opacity: ring.opacity,
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              animation: 'none',
            }}
            animate={prefersReducedMotion ? undefined : { rotate: ring.dir * 360 }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: ring.baseDuration / safeSpeed,
                    repeat: Infinity,
                    ease: 'linear' as const,
                  }
            }
          />
        )
      })}
    </div>
  )
}

export const LoadingStatesRingMulti = memo(LoadingStatesRingMultiComponent)
