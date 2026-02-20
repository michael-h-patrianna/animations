import { memo, useState } from 'react'
import * as m from 'motion/react-m'

function ButtonFeedbackShakeGentleComponent() {
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
    <div
      className="button-demo"
      data-animation-id="bxf-feedback__shake-gentle"
    >
      <m.button
        className="pf-btn pf-btn--primary"
        onClick={handleClick}
        initial={{
          x: 0,
          scale: 1,
          opacity: 1,
        }}
        animate={
          isAnimating
            ? prefersReducedMotion
              ? {
                  opacity: [1, 0.85, 1],
                }
              : {
                  x: [0, -20, 16, -8, 0],
                  scale: [1, 0.98, 0.92, 0.98, 1],
                  opacity: [1, 0.7, 0.7, 0.85, 1],
                }
            : {
                x: 0,
                scale: 1,
                opacity: 1,
              }
        }
        transition={
          prefersReducedMotion
            ? {
                duration: 0.4,
                times: [0, 0.5, 1],
                ease: 'easeOut',
              }
            : {
                duration: 0.4,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: [0.45, 0.05, 0.55, 0.95],
                opacity: {
                  duration: 0.4,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: [0.4, 0.0, 0.6, 1],
                },
              }
        }
        onAnimationComplete={handleAnimationComplete}
        aria-label="Insufficient funds"
        aria-live="polite"
      >
        Click Me
      </m.button>
    </div>
  )
}

export const ButtonFeedbackShakeGentle = memo(ButtonFeedbackShakeGentleComponent)
