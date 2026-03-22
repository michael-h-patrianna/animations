/**
 * Reward Ready Pulse — wraps any element with a breathing scale + vertical bob
 * to signal "ready to claim". Pauses on hover, compresses on tap.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <ButtonEffectsRewardReadyPulse><button>Claim Reward</button></ButtonEffectsRewardReadyPulse>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useState, type ReactNode } from 'react'

interface ButtonEffectsRewardReadyPulseProps {
  children?: ReactNode
  /** Pulse cycle duration in ms. Default: 2000 */
  duration?: number
  /** Peak scale at pulse apex. Default: 1.08 */
  pulseScale?: number
  /** Vertical bob distance in px. Default: 4 */
  bobDistance?: number
}

function ButtonEffectsRewardReadyPulseComponent({
  children,
  duration = 2000,
  pulseScale = 1.08,
  bobDistance = 4,
}: ButtonEffectsRewardReadyPulseProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const durationS = duration / 1000

  const pulseVariants = {
    animate: {
      scale: [1, pulseScale, 1],
      y: [0, -bobDistance, 0],
      transition: {
        duration: durationS,
        ease: [0.4, 0.0, 0.6, 1.0] as const,
        repeat: Infinity,
      },
    },
  }

  const reducedMotionVariants = {
    animate: {
      scale: [1, 1.02, 1],
      y: [0, 0, 0],
      transition: {
        duration: durationS * 1.5,
        ease: 'easeInOut' as const,
        repeat: Infinity,
      },
    },
  }

  const hoverVariants = {
    animate: {
      scale: pulseScale + 0.04,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <m.div
      data-animation-id="button-effects__reward-ready-pulse"
      style={{ display: 'inline-flex', willChange: 'transform', animation: 'none' }}
      variants={
        isHovered ? hoverVariants : prefersReducedMotion ? reducedMotionVariants : pulseVariants
      }
      animate="animate"
      whileTap={{ scale: 0.95, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children ?? (
        <button type="button" className="pf-btn pf-btn--primary">
          Claim Reward
        </button>
      )}
    </m.div>
  )
}

export const ButtonEffectsRewardReadyPulse = memo(ButtonEffectsRewardReadyPulseComponent)
