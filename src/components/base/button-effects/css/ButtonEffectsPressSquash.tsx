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
    <button
      type="button"
      data-animation-id="button-effects__press-squash"
      className={`pf-demo-btn pf-demo-btn--primary pf-press-squash ${isAnimating ? 'pf-press-squash--active' : ''}`}
      onClick={() => setIsAnimating(true)}
    >
      Click Me!
    </button>
  )
}

export const ButtonEffectsPressSquash = memo(ButtonEffectsPressSquashComponent)
