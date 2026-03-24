/**
 * Catalog display for the Swing CSS effect.
 * Consumer product: StandardEffectsSwing.css — apply .pf-swing to any element.
 */
import { memo } from 'react'
import './StandardEffectsSwing.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsSwingComponent() {
  return <DemoBox className="pf-swing" label="Swing" data-animation-id="standard-effects__swing" />
}

export const StandardEffectsSwing = memo(StandardEffectsSwingComponent)
