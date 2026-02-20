import { memo, useState } from 'react'
import * as m from 'motion/react-m'
import '../shared.css'

/**
 * Framer Motion press squash animation that triggers on click.
 * Simulates vertical squash deformation with horizontal expansion for tactile press feedback.
 *
 * @returns Button with press squash animation
 */
function ButtonEffectsPressSquashComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleClick = () => {
    setIsAnimating(true)
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__press-squash">
      <m.button
        className="pf-btn pf-btn--primary"
        onClick={handleClick}
        initial={{
          scaleX: 1,
          scaleY: 1,
          y: 0,
        }}
        animate={
          isAnimating
            ? prefersReducedMotion
              ? {
                  scaleX: 1,
                  scaleY: 1,
                  y: 0,
                }
              : {
                  scaleX: [1, 1.15, 0.95, 1],
                  scaleY: [1, 0.85, 1.05, 1],
                  y: ['0%', '7.5%', '-2.5%', '0%'],
                }
            : {
                scaleX: 1,
                scaleY: 1,
                y: 0,
              }
        }
        transition={{
          duration: 0.3,
          ease: [0.34, 1.56, 0.64, 1],
          times: [0, 0.35, 0.65, 1],
        }}
        onAnimationComplete={handleAnimationComplete}
        style={{ transformOrigin: 'center bottom' }}
      >
        Click Me!
      </m.button>
    </div>
  )
}

export const ButtonEffectsPressSquash = memo(ButtonEffectsPressSquashComponent)
