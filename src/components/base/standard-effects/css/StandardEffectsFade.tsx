/**
 * Catalog display for the Fade CSS effect.
 * Consumer product: StandardEffectsFade.css — apply .pf-fade to any element.
 */
import { memo } from 'react'
import './StandardEffectsFade.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsFadeComponent() {
  return (
    <DemoBox className="pf-fade" label="Fade" data-animation-id="standard-effects__fade" />
  )
}

export const StandardEffectsFade = memo(StandardEffectsFadeComponent)
