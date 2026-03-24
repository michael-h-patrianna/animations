/**
 * Catalog display for the Shake Gentle CSS effect.
 * Consumer product: ButtonFeedbackShakeGentle.css — apply .pf-shake-gentle + toggle --active.
 */
import { memo, useEffect, useState } from 'react'
import './ButtonFeedbackShakeGentle.css'
import { DemoButton } from '@/components/demo-blocks'

function ButtonFeedbackShakeGentleComponent() {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 400)
    return () => clearTimeout(timer)
  }, [isAnimating])

  return (
    <DemoButton
      data-animation-id="button-effects__shake-gentle"
      className={`pf-shake-gentle ${isAnimating ? 'pf-shake-gentle--active' : ''}`}
      onClick={() => setIsAnimating(true)}
      aria-label="Insufficient funds"
      aria-live="polite"
      label="Click Me"
    />
  )
}

export const ButtonFeedbackShakeGentle = memo(ButtonFeedbackShakeGentleComponent)
