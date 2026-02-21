import { memo, useEffect, useState } from 'react'
import '../shared.css'
import './ButtonEffectsSplitReveal.css'

/**
 * Split reveal effect where button text separates to reveal hidden content.
 *
 * @returns Button with click-triggered split and reveal animation
 */
function ButtonEffectsSplitRevealComponent() {
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    if (!isRevealing) return
    const timer = setTimeout(() => setIsRevealing(false), 800)
    return () => clearTimeout(timer)
  }, [isRevealing])

  const handleClick = () => {
    setIsRevealing(true)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__split-reveal">
      <button type="button"
        className={`pf-btn pf-btn--primary bfx-split-reveal ${isRevealing ? 'bfx-split-reveal--active' : ''}`}
        onClick={handleClick}
      >
        <span className="bfx-split-reveal__top">Click</span>
        <span className="bfx-split-reveal__bottom">Me!</span>
        <span className="bfx-split-reveal__content">✨</span>
      </button>
    </div>
  )
}

export const ButtonEffectsSplitReveal = memo(ButtonEffectsSplitRevealComponent)

