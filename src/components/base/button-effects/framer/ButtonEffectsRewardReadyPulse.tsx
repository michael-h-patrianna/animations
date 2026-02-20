import * as m from 'motion/react-m'
import { memo, useState } from 'react'

/**
 * Framer Motion-driven reward ready pulse animation.
 *
 * Combines scale pulsing (1.0 → 1.08 → 1.0) with vertical bobbing (0 → -4px → 0)
 * to create a "breathing" effect indicating an element is ready to claim.
 *
 * Features:
 * - Infinite loop animation (2000ms cycle)
 * - Hover: scale to 1.12 (pauses pulse)
 * - Press: scale to 0.95
 * - Reduced motion support: subtle 1.02 scale at 3s cycle
 *
 * @returns Button with reward ready pulse animation
 */
function ButtonEffectsRewardReadyPulseComponent() {
  const [isHovered, setIsHovered] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Normal breathing pulse animation
  const pulseVariants = {
    animate: {
      scale: [1, 1.08, 1],
      y: [0, -4, 0],
      transition: {
        duration: 2,
        ease: [0.4, 0.0, 0.6, 1.0] as const,
        repeat: Infinity,
      },
    },
  }

  // Reduced motion: subtle pulse only
  const reducedMotionVariants = {
    animate: {
      scale: [1, 1.02, 1],
      y: [0, 0, 0],
      transition: {
        duration: 3,
        ease: 'easeInOut' as const,
        repeat: Infinity,
      },
    },
  }

  // Hover state: scale up, no pulse
  const hoverVariants = {
    animate: {
      scale: 1.12,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__reward-ready-pulse">
      <m.button
        className="pf-btn pf-btn--primary"
        variants={
          isHovered ? hoverVariants : prefersReducedMotion ? reducedMotionVariants : pulseVariants
        }
        animate="animate"
        whileTap={{ scale: 0.95, y: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ willChange: 'transform' }}
      >

        Claim Reward
      </m.button>
    </div>
  )
}

/**
 * Memoized ButtonEffectsRewardReadyPulse to prevent unnecessary re-renders in grid layouts.
 */
export const ButtonEffectsRewardReadyPulse = memo(ButtonEffectsRewardReadyPulseComponent)
