/**
 * Catalog display for the Shake Gentle CSS effect.
 * Consumer product: ButtonFeedbackShakeGentle.css — apply .pf-shake-gentle + toggle --active.
 */
import { memo, useEffect, useState } from 'react'
import './ButtonFeedbackShakeGentle.css'

function ButtonFeedbackShakeGentleComponent() {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 400)
    return () => clearTimeout(timer)
  }, [isAnimating])

  return (
    <div data-animation-id="button-effects__shake-gentle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        type="button"
        className={`pf-btn pf-btn--primary pf-shake-gentle ${isAnimating ? 'pf-shake-gentle--active' : ''}`}
        onClick={() => setIsAnimating(true)}
        aria-label="Insufficient funds"
        aria-live="polite"
      >
        Click Me
      </button>
    </div>
  )
}

export const ButtonFeedbackShakeGentle = memo(ButtonFeedbackShakeGentleComponent)
