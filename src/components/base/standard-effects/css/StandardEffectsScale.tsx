/**
 * Catalog display for the Scale CSS effect.
 * Consumer product: StandardEffectsScale.css — apply .pf-scale to any element.
 */
import { memo } from 'react'
import './StandardEffectsScale.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsScaleComponent() {
  return <DemoBox className="pf-scale" label="Scale" data-animation-id="standard-effects__scale" />
}

export const StandardEffectsScale = memo(StandardEffectsScaleComponent)
