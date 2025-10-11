import { useState } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './ButtonEffectsLiquidMorph.css'
import '../shared.css'

export function ButtonEffectsLiquidMorph() {
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

export const metadata: AnimationMetadata = {
  id: 'button-effects__liquid-morph',
  title: 'Liquid Morph',
  description: 'Button liquifies and reshapes on click with elastic blob-like deformation.',
  tags: ['css', 'js'],
  disableReplay: true,
}
