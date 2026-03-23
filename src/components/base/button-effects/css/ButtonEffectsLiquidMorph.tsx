/**
 * Catalog display for the Liquid Morph CSS effect.
 * Consumer product: ButtonEffectsLiquidMorph.css — apply .pf-liquid-morph + toggle --active.
 */
import { memo, useEffect, useState } from 'react'
import './ButtonEffectsLiquidMorph.css'

function ButtonEffectsLiquidMorphComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 600)
    return () => clearTimeout(timer)
  }, [isAnimating])

  return (
    <button
      type="button"
      data-animation-id="button-effects__liquid-morph"
      className={`pf-demo-btn pf-demo-btn--primary pf-liquid-morph ${isAnimating ? 'pf-liquid-morph--active' : ''}`}
      onClick={() => setIsAnimating(true)}
    >
      Click Me!
    </button>
  )
}

export const ButtonEffectsLiquidMorph = memo(ButtonEffectsLiquidMorphComponent)
