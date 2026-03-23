/**
 * Catalog display for the Spin CSS effect.
 * Consumer product: StandardEffectsSpin.css — apply .pf-spin to any element.
 */
import { memo } from 'react'
import './StandardEffectsSpin.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsSpinComponent() {
  return (
    <DemoBox className="pf-spin" label="Spin" data-animation-id="standard-effects__spin" />
  )
}

export const StandardEffectsSpin = memo(StandardEffectsSpinComponent)
