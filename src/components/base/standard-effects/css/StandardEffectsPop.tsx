/**
 * Catalog display for the Pop CSS effect.
 * Consumer product: StandardEffectsPop.css — apply .pf-pop to any element.
 */
import { memo } from 'react'
import './StandardEffectsPop.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsPopComponent() {
  return (
    <DemoBox className="pf-pop" label="Pop" data-animation-id="standard-effects__pop" />
  )
}

export const StandardEffectsPop = memo(StandardEffectsPopComponent)
