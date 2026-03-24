/**
 * Catalog display for the Pulse CSS effect.
 * Consumer product: StandardEffectsPulse.css — apply .pf-pulse to any element.
 */
import { memo } from 'react'
import './StandardEffectsPulse.css'
import { DemoBox } from '@/components/demo-blocks'

function StandardEffectsPulseComponent() {
  return <DemoBox className="pf-pulse" label="Pulse" data-animation-id="standard-effects__pulse" />
}

export const StandardEffectsPulse = memo(StandardEffectsPulseComponent)
