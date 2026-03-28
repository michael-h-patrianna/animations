/**
 * Liquid Morph — wraps any element with a click-triggered blob-like deformation.
 * Organic scale + rotation + border-radius morphing for fluid feedback.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <ButtonEffectsLiquidMorph><button onClick={buy}>Buy Now</button></ButtonEffectsLiquidMorph>
 */

import * as m from 'motion/react-m'
import { easeOut, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState, memo, type ReactNode } from 'react'

interface ButtonEffectsLiquidMorphProps {
  children?: ReactNode
  /** Morph animation duration in ms. Default: 600 */
  duration?: number
}

function ButtonEffectsLiquidMorphComponent({
  children,
  duration = 600,
}: ButtonEffectsLiquidMorphProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), duration)
    return () => clearTimeout(timer)
  }, [isAnimating, duration])

  const handleClick = () => {
    setIsAnimating(true)
  }

  const liquidMorphVariants = useMemo(
    () => ({
      initial: {
        scale: 1,
        rotate: 0,
        borderRadius: '50px',
      },
      animate: {
        scale: [1, 0.95, 1.08, 0.96, 1],
        rotate: [0, -2, 3, -1, 0],
        borderRadius: [
          '50px',
          '50px 40px 50px 60px',
          '60px 50px 40px 50px',
          '45px 55px 50px 45px',
          '50px',
        ],
        transition: {
          duration: duration / 1000,
          ease: easeOut,
          times: [0, 0.25, 0.5, 0.75, 1],
        },
      },
    }),
    [duration]
  )

  return (
    <m.button
      type="button"
      className="pf-demo-btn pf-demo-btn--primary"
      data-animation-id="button-effects__liquid-morph"
      onClick={handleClick}
      variants={prefersReducedMotion ? undefined : liquidMorphVariants}
      initial="initial"
      animate={
        prefersReducedMotion
          ? isAnimating
            ? { scale: [1, 0.97, 1.02, 1], opacity: [1, 0.85, 1, 1] }
            : { scale: 1, opacity: 1 }
          : isAnimating
            ? 'animate'
            : 'initial'
      }
      transition={prefersReducedMotion ? { duration: 0.3, ease: 'easeInOut' } : undefined}
    >
      {children ?? 'Click Me!'}
    </m.button>
  )
}

export const ButtonEffectsLiquidMorph = memo(ButtonEffectsLiquidMorphComponent)
