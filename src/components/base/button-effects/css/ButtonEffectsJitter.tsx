/**
 * Catalog display for the Jitter CSS effect.
 * Consumer product: ButtonEffectsJitter.css — apply .pf-jitter to any element.
 */
import { memo } from 'react'
import './ButtonEffectsJitter.css'

function ButtonEffectsJitterComponent() {
  return (
    <div data-animation-id="button-effects__jitter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button type="button" className="pf-btn pf-btn--primary pf-jitter">
        Click Me!
      </button>
    </div>
  )
}

export const ButtonEffectsJitter = memo(ButtonEffectsJitterComponent)
