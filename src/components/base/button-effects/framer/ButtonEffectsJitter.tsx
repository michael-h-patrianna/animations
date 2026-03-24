/**
 * Jitter — wraps any element with a looping scale-burst + rotation wobble.
 * On hover, switches to a gentle heartbeat pulse.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <ButtonEffectsJitter duration={4000}><button>Buy Now</button></ButtonEffectsJitter>
 */

import * as m from 'motion/react-m'
import { useMemo, useState, memo, type ReactNode } from 'react'

const HEARTBEAT_VARIANTS = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.2,
      ease: 'linear' as const,
      repeat: Infinity,
    },
  },
}

interface ButtonEffectsJitterProps {
  children?: ReactNode
  /** Full jitter cycle duration in ms. Default: 4000 */
  duration?: number
}

function ButtonEffectsJitterComponent({ children, duration = 4000 }: ButtonEffectsJitterProps) {
  const [isHovered, setIsHovered] = useState(false)

  const jitterVariants = useMemo(
    () => ({
      animate: {
        scale: [1, 0.9, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1],
        rotate: [0, 0, 0, -5, 5, -3, 2, 0, 0, 0],
        transition: {
          duration: duration / 1000,
          ease: 'linear' as const,
          repeat: Infinity,
          times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 1],
        },
      },
    }),
    [duration]
  )

  return (
    <m.button
      type="button"
      className="pf-demo-btn pf-demo-btn--primary"
      data-animation-id="button-effects__jitter"
      style={{ animation: 'none' }}
      variants={isHovered ? HEARTBEAT_VARIANTS : jitterVariants}
      animate="animate"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children ?? 'Click Me!'}
    </m.button>
  )
}

export const ButtonEffectsJitter = memo(ButtonEffectsJitterComponent)
