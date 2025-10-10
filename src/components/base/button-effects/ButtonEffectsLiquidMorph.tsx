import { useState } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './ButtonEffectsLiquidMorph.css'
import './shared.css'

export function ButtonEffectsLiquidMorph() {
  const shouldReduceMotion = useReducedMotion()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (shouldReduceMotion) return
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
      scale: [1, [0.95, 1.05], [1.08, 0.92], [0.96, 1.04], 1],
      rotate: [0, -2, 3, -1, 0],
      borderRadius: ['50px', '50px 40px 50px 60px', '60px 50px 40px 50px', '45px 55px 50px 45px', '50px'],
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div className="button-demo" data-animation-id="button-effects__liquid-morph">
        <button className="pf-btn pf-btn--primary pf-btn--liquid-morph" onClick={handleClick}>
          Click Me!
        </button>
      </div>
    )
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__liquid-morph">
      <motion.button
        className="pf-btn pf-btn--primary pf-btn--liquid-morph"
        onClick={handleClick}
        variants={liquidMorphVariants}
        initial="initial"
        animate={isAnimating ? 'animate' : 'initial'}
      >
        Click Me!
      </motion.button>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'button-effects__liquid-morph',
  title: 'Liquid Morph',
  description: 'Button liquifies and reshapes on click with elastic blob-like deformation.',
  tags: ['framer'],
  disableReplay: true,
}
