/**
 * Catalog display for the Tada CSS effect.
 * Consumer product: StandardEffectsTada.css — apply .pf-tada to any element.
 */
import { memo } from 'react'
import './StandardEffectsTada.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsTadaComponent() {
  return <DemoBox className="pf-tada" label="Tada" data-animation-id="standard-effects__tada" />
}

export const StandardEffectsTada = memo(StandardEffectsTadaComponent)
