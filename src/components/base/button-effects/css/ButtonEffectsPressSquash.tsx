/**
 * Catalog display for the Press Squash CSS effect.
 * Consumer product: ButtonEffectsPressSquash.css — apply .pf-press-squash + toggle --active.
 */
import { memo, useEffect, useState } from 'react'
import './ButtonEffectsPressSquash.css'
import { DemoButton } from '@/components/demo-blocks'

function ButtonEffectsPressSquashComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isAnimating])

  return (
    <DemoButton
      data-animation-id="button-effects__press-squash"
      className={`pf-press-squash ${isAnimating ? 'pf-press-squash--active' : ''}`}
      onClick={() => setIsAnimating(true)}
      label="Click Me!"
    />
  )
}

export const ButtonEffectsPressSquash = memo(ButtonEffectsPressSquashComponent)
