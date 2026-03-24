/**
 * Press Squash — wraps any element with a click-triggered squash-and-stretch.
 * Vertical compression + horizontal expansion anchored at bottom for tactile feedback.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <ButtonEffectsPressSquash><button onClick={buy}>Buy Now</button></ButtonEffectsPressSquash>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useState, type ReactNode } from 'react'

interface ButtonEffectsPressSquashProps {
  children?: ReactNode
  /** Squash animation duration in ms. Default: 300 */
  duration?: number
}

function ButtonEffectsPressSquashComponent({
  children,
  duration = 300,
}: ButtonEffectsPressSquashProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const durationS = duration / 1000

  const handleClick = () => {
    setIsAnimating(true)
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  return (
    <m.button
      type="button"
      className="pf-demo-btn pf-demo-btn--primary"
      data-animation-id="button-effects__press-squash"
      style={{ transformOrigin: 'center bottom', animation: 'none' }}
      onClick={handleClick}
      initial={{ scaleX: 1, scaleY: 1, y: 0 }}
      animate={
        isAnimating && !prefersReducedMotion
          ? {
              scaleX: [1, 1.15, 0.95, 1],
              scaleY: [1, 0.85, 1.05, 1],
              y: ['0%', '7.5%', '-2.5%', '0%'],
            }
          : { scaleX: 1, scaleY: 1, y: 0 }
      }
      transition={{
        duration: durationS,
        ease: [0.34, 1.56, 0.64, 1],
        times: [0, 0.35, 0.65, 1],
      }}
      onAnimationComplete={handleAnimationComplete}
    >
      {children ?? 'Click Me!'}
    </m.button>
  )
}

export const ButtonEffectsPressSquash = memo(ButtonEffectsPressSquashComponent)
