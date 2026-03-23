/**
 * Catalog display for the Jitter CSS effect.
 * Consumer product: ButtonEffectsJitter.css — apply .pf-jitter to any element.
 */
import { memo } from 'react'
import './ButtonEffectsJitter.css'
import { DemoButton } from '@/components/demo-blocks'

function ButtonEffectsJitterComponent() {
  return (
    <DemoButton className="pf-jitter" label="Click Me!" data-animation-id="button-effects__jitter" />
  )
}

export const ButtonEffectsJitter = memo(ButtonEffectsJitterComponent)
