/**
 * Catalog display for the Flip CSS effect.
 * Consumer product: StandardEffectsFlip.css — apply .pf-flip to any element.
 */
import { memo } from 'react'
import './StandardEffectsFlip.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsFlipComponent() {
  return (
    <DemoBox className="pf-flip" label="Flip" data-animation-id="standard-effects__flip" />
  )
}

export const StandardEffectsFlip = memo(StandardEffectsFlipComponent)
