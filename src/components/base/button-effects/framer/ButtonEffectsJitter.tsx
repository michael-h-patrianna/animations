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
import { useState, memo, type ReactNode } from 'react'

interface ButtonEffectsJitterProps {
  children?: ReactNode
  /** Full jitter cycle duration in ms. Default: 4000 */
  duration?: number
}

function ButtonEffectsJitterComponent({
  children,
  duration = 4000,
}: ButtonEffectsJitterProps) {
  const [isHovered, setIsHovered] = useState(false)

  const durationS = duration / 1000

  const jitterVariants = {
    animate: {
      scale: [1, 0.9, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1],
      rotate: [0, 0, 0, -5, 5, -3, 2, 0, 0, 0],
      transition: {
        duration: durationS,
        ease: 'linear' as const,
        repeat: Infinity,
        times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 1],
      },
    },
  }

  const heartbeatVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.2,
        ease: 'linear' as const,
        repeat: Infinity,
      },
    },
  }

  return (
    <m.div
      data-animation-id="button-effects__jitter"
      style={{ display: 'inline-flex', animation: 'none' }}
      variants={isHovered ? heartbeatVariants : jitterVariants}
      animate="animate"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children ?? (
        <button type="button" className="pf-btn pf-btn--primary">
          Click Me!
        </button>
      )}
    </m.div>
  )
}

export const ButtonEffectsJitter = memo(ButtonEffectsJitterComponent)
