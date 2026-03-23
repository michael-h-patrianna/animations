/**
 * Catalog display for the Jello CSS effect.
 * Consumer product: StandardEffectsJello.css — apply .pf-jello to any element.
 */
import { memo } from 'react'
import './StandardEffectsJello.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsJelloComponent() {
  return (
    <DemoBox className="pf-jello" label="Jello" data-animation-id="standard-effects__jello" />
  )
}

export const StandardEffectsJello = memo(StandardEffectsJelloComponent)
