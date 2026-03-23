/**
 * Catalog display for the Wiggle CSS effect.
 * Consumer product: StandardEffectsWiggle.css — apply .pf-wiggle to any element.
 */
import { memo } from 'react'
import './StandardEffectsWiggle.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsWiggleComponent() {
  return (
    <DemoBox className="pf-wiggle" label="Wiggle" data-animation-id="standard-effects__wiggle" />
  )
}

export const StandardEffectsWiggle = memo(StandardEffectsWiggleComponent)
