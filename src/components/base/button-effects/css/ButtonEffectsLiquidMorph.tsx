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
    <div
      data-animation-id="button-effects__liquid-morph"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <button
        type="button"
        className={`pf-btn pf-btn--primary pf-liquid-morph ${isAnimating ? 'pf-liquid-morph--active' : ''}`}
        onClick={() => setIsAnimating(true)}
      >
        Click Me!
      </button>
    </div>
  )
}

export const ButtonEffectsLiquidMorph = memo(ButtonEffectsLiquidMorphComponent)
