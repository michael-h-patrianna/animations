/**
 * Catalog display for the Shake CSS effect.
 * Consumer product: StandardEffectsShake.css — apply .pf-shake to any element.
 */
import { memo } from 'react'
import './StandardEffectsShake.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsShakeComponent() {
  return <DemoBox className="pf-shake" label="Shake" data-animation-id="standard-effects__shake" />
}

export const StandardEffectsShake = memo(StandardEffectsShakeComponent)
