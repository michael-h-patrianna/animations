/**
 * Catalog display for the Blink CSS effect.
 * Consumer product: StandardEffectsBlink.css — apply .pf-blink to any element.
 */
import { memo } from 'react'
import './StandardEffectsBlink.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsBlinkComponent() {
  return <DemoBox className="pf-blink" label="Blink" data-animation-id="standard-effects__blink" />
}

export const StandardEffectsBlink = memo(StandardEffectsBlinkComponent)
