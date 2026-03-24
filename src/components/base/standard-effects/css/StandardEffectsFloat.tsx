/**
 * Catalog display for the Float CSS effect.
 * Consumer product: StandardEffectsFloat.css — apply .pf-float to any element.
 */
import { memo } from 'react'
import './StandardEffectsFloat.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsFloatComponent() {
  return <DemoBox className="pf-float" label="Float" data-animation-id="standard-effects__float" />
}

export const StandardEffectsFloat = memo(StandardEffectsFloatComponent)
