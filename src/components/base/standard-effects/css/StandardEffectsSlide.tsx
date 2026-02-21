import { memo } from 'react'
import '../shared.css'
import './StandardEffectsSlide.css'

function StandardEffectsSlideComponent() {
  return (
    <div className="standard-demo-container" data-animation-id="standard-effects__slide">
      <div className="standard-demo-element slide-element">
        <div className="demo-text">Slide</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSlide to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)

