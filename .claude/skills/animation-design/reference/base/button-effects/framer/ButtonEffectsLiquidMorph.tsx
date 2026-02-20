import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useState, memo } from 'react'
import '../shared.css'
import './ButtonEffectsLiquidMorph.css'

function ButtonEffectsLiquidMorphComponent() {
const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const liquidMorphVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      borderRadius: '50px',
    },
    animate: {
      scale: [1, 0.95, 1.08, 0.96, 1],
      rotate: [0, -2, 3, -1, 0],
      borderRadius: ['50px', '50px 40px 50px 60px', '60px 50px 40px 50px', '45px 55px 50px 45px', '50px'],
      transition: {
        duration: 0.6,
        ease: easeOut,
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  }
  return (
    <div className="button-demo" data-animation-id="button-effects__liquid-morph">
      <m.button
        className="pf-btn pf-btn--primary pf-btn--liquid-morph"
        onClick={handleClick}
        variants={liquidMorphVariants}
        initial="initial"
        animate={isAnimating ? 'animate' : 'initial'}
      >
        Click Me!
      </m.button>
    </div>
  )
}

/**
 * Memoized ButtonEffectsLiquidMorph to prevent unnecessary re-renders in grid layouts.
 */
export const ButtonEffectsLiquidMorph = memo(ButtonEffectsLiquidMorphComponent)

