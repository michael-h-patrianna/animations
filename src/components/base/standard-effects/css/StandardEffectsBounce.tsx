/**
 * Catalog display for the Bounce CSS effect.
 * Consumer product: StandardEffectsBounce.css — apply .pf-bounce to any element.
 */
import { memo } from 'react'
import './StandardEffectsBounce.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsBounceComponent() {
  return (
    <DemoBox className="pf-bounce" label="Bounce" data-animation-id="standard-effects__bounce" />
  )
}

export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)
