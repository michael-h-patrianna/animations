/**
 * Catalog display for the Slide CSS effect.
 * Consumer product: StandardEffectsSlide.css — apply .pf-slide to any element.
 */
import { memo } from 'react'
import './StandardEffectsSlide.css'

function StandardEffectsSlideComponent() {
  return (
    <div className="pf-standard-demo" data-animation-id="standard-effects__slide">
      <div className="pf-slide pf-standard-demo__element">
        <span className="pf-standard-demo__label">Slide</span>
      </div>
    </div>
  )
}

export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)
