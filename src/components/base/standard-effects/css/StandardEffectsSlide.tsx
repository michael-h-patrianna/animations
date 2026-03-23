/**
 * Catalog display for the Slide CSS effect.
 * Consumer product: StandardEffectsSlide.css — apply .pf-slide to any element.
 */
import { memo } from 'react'
import './StandardEffectsSlide.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsSlideComponent() {
  return (
    <DemoBox className="pf-slide" label="Slide" data-animation-id="standard-effects__slide" />
  )
}

export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)
