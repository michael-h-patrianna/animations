import { memo, useEffect, useState } from 'react'
import '../shared.css'
import './ButtonEffectsLiquidMorph.css'

/**
 * Liquid morph effect triggered on click with blob-like deformation.
 *
 * @returns Button with click-triggered liquid morph animation
 */
function ButtonEffectsLiquidMorphComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 600)
    return () => clearTimeout(timer)
  }, [isAnimating])

  const handleClick = () => {
    setIsAnimating(true)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__liquid-morph">
      <button type="button"
        className={`pf-btn pf-btn--primary bfx-liquid-morph ${isAnimating ? 'bfx-liquid-morph--active' : ''}`}
        onClick={handleClick}
      >
        Click Me!
      </button>
    </div>
  )
}

export const ButtonEffectsLiquidMorph = memo(ButtonEffectsLiquidMorphComponent)

