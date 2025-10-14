import { memo } from 'react'
import '../shared.css'
import './StandardEffectsSlide.css'

function StandardEffectsSlideComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element slide-element css-slide-animation">
        <div className="demo-text">Slide</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSlide to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)

