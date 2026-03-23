/**
 * Catalog display for the Squeeze CSS effect.
 * Consumer product: StandardEffectsSqueeze.css — apply .pf-squeeze to any element.
 */
import { memo } from 'react'
import './StandardEffectsSqueeze.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsSqueezeComponent() {
  return (
    <DemoBox className="pf-squeeze" label="Squeeze" data-animation-id="standard-effects__squeeze" />
  )
}

export const StandardEffectsSqueeze = memo(StandardEffectsSqueezeComponent)
