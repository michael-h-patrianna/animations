import * as m from 'motion/react-m'

import { useEffect, useState, memo } from 'react'

const topVariants = {
  closed: { y: 0, rotate: 0 },
  open: { y: -15, rotate: -5 },
}

const bottomVariants = {
  closed: { y: 0, rotate: 0 },
  open: { y: 15, rotate: 5 },
}

const revealVariants = {
  closed: { scale: 0 },
  open: { scale: 1.2 },
}

const SPLIT_TRANSITION = { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] as const }

function ButtonEffectsSplitRevealComponent() {
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    if (!isRevealing) return
    const timer = setTimeout(() => setIsRevealing(false), 800)
    return () => clearTimeout(timer)
  }, [isRevealing])

  const state = isRevealing ? 'open' : 'closed'

  return (
    <div className="button-demo" data-animation-id="button-effects__split-reveal">
      <button
        type="button"
        className="pf-btn pf-btn--primary pf-btn--split-reveal"
        onClick={() => setIsRevealing(true)}
      >
        <m.span
          className="pf-btn__split-top"
          variants={topVariants}
          animate={state}
          transition={SPLIT_TRANSITION}
        >
          Click
        </m.span>
        <m.span
          className="pf-btn__split-bottom"
          variants={bottomVariants}
          animate={state}
          transition={SPLIT_TRANSITION}
        >
          Me!
        </m.span>
        <m.span
          className="pf-btn__split-reveal-content"
          variants={revealVariants}
          animate={state}
          transition={SPLIT_TRANSITION}
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
