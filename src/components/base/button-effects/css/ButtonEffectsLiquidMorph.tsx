/**
 * Catalog display for the Liquid Morph CSS effect.
 * Consumer product: ButtonEffectsLiquidMorph.css — apply .pf-liquid-morph + toggle --active.
 */
import { memo, useEffect, useState } from 'react'
import './ButtonEffectsLiquidMorph.css'
import { DemoButton } from '@/components/demo-blocks'

function ButtonEffectsLiquidMorphComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 600)
    return () => clearTimeout(timer)
  }, [isAnimating])

  return (
    <DemoButton
      data-animation-id="button-effects__liquid-morph"
      className={`pf-liquid-morph ${isAnimating ? 'pf-liquid-morph--active' : ''}`}
      onClick={() => setIsAnimating(true)}
      label="Click Me!"
    />
  )
}

export const ButtonEffectsLiquidMorph = memo(ButtonEffectsLiquidMorphComponent)
