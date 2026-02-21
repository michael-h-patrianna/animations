import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'

function StandardEffectsSlideComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__slide">
      <m.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center left' }}
        initial={{ x: '-100%', scale: 0.8, rotate: -5, opacity: 0 }}
        animate={{ x: 0, scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: easeOut,
        }}
      >
        <div className="demo-text">Slide</div>
      </m.div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSlide to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)

