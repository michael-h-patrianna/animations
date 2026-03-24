/**
 * Catalog display for the Rubber Band CSS effect.
 * Consumer product: StandardEffectsRubberBand.css — apply .pf-rubber-band to any element.
 */
import { memo } from 'react'
import './StandardEffectsRubberBand.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsRubberBandComponent() {
  return (
    <DemoBox
      className="pf-rubber-band"
      label="RubberBand"
      data-animation-id="standard-effects__rubber-band"
    />
  )
}

export const StandardEffectsRubberBand = memo(StandardEffectsRubberBandComponent)
