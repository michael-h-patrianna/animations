/**
 * Catalog display for the Press Squash CSS effect.
 * Consumer product: ButtonEffectsPressSquash.css — apply .pf-press-squash + toggle --active.
 */
import { memo, useEffect, useState } from 'react'
import './ButtonEffectsPressSquash.css'

function ButtonEffectsPressSquashComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isAnimating])

  return (
    <div data-animation-id="button-effects__press-squash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        type="button"
        className={`pf-btn pf-btn--primary pf-press-squash ${isAnimating ? 'pf-press-squash--active' : ''}`}
        onClick={() => setIsAnimating(true)}
      >
        Click Me!
      </button>
    </div>
  )
}

export const ButtonEffectsPressSquash = memo(ButtonEffectsPressSquashComponent)
