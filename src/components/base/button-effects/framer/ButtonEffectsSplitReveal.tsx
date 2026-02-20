import * as m from 'motion/react-m'

import { useState, memo } from 'react'

function ButtonEffectsSplitRevealComponent() {
  const [isRevealing, setIsRevealing] = useState(false)
const handleClick = () => {
    setIsRevealing(true)
    setTimeout(() => setIsRevealing(false), 800)
  }
  return (
    <div className="button-demo" data-animation-id="button-effects__split-reveal">
      <button
        className="pf-btn pf-btn--primary pf-btn--split-reveal"
        onClick={handleClick}
      >
        <m.span
          className="pf-btn__split-top"
          animate={isRevealing ? {
            y: -15,
            rotate: -5,
            transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
          } : {
            y: 0,
            rotate: 0,
            transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
          }}
        >
          Click
        </m.span>
        <m.span
          className="pf-btn__split-bottom"
          animate={isRevealing ? {
            y: 15,
            rotate: 5,
            transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
          } : {
            y: 0,
            rotate: 0,
            transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
          }}
        >
          Me!
        </m.span>
        <m.span
          className="pf-btn__split-reveal-content"
          animate={isRevealing ? {
            scale: 1.2,
            transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
          } : {
            scale: 0,
            transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
          }}
        >
          ✨
        </m.span>
      </button>
    </div>
  )
}

/**
 * Memoized ButtonEffectsSplitReveal to prevent unnecessary re-renders in grid layouts.
 */
export const ButtonEffectsSplitReveal = memo(ButtonEffectsSplitRevealComponent)

