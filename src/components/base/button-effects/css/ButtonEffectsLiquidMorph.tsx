import { useState, memo } from 'react'
import './ButtonEffectsLiquidMorph.css'
import '../shared.css'

function ButtonEffectsLiquidMorphComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__liquid-morph">
      <button
        className={`pf-btn pf-btn--primary pf-btn--liquid-morph ${isAnimating ? 'liquid-morph-active' : ''}`}
        onClick={handleClick}
      >
        Click Me!
      </button>
    </div>
  )
}

/**
 * Memoized ButtonEffectsLiquidMorph to prevent unnecessary re-renders in grid layouts.
 */
export const ButtonEffectsLiquidMorph = memo(ButtonEffectsLiquidMorphComponent)

