import { memo, useState } from 'react'
import '../shared.css'
import './ButtonEffectsPressSquash.css'

/**
 * CSS-driven press squash animation that triggers on click.
 * Simulates vertical squash deformation with horizontal expansion for tactile press feedback.
 *
 * @returns Button with press squash animation
 */
function ButtonEffectsPressSquashComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__press-squash">
      <button
        className={`pf-btn pf-btn--primary bfx-press-squash ${isAnimating ? 'bfx-press-squash--active' : ''}`}
        onClick={handleClick}
      >
        Click Me!
      </button>
    </div>
  )
}

export const ButtonEffectsPressSquash = memo(ButtonEffectsPressSquashComponent)
