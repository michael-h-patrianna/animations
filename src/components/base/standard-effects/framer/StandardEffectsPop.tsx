import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import '../shared.css'
import './StandardEffectsPop.css'

export function StandardEffectsPop() {
  const shouldReduceMotion = useReducedMotion()

  const popVariants = {
    animate: {
      scale: [0, 1.2, 1],
      rotate: [0, 5, 0],
      opacity: [0, 0.8, 1],
      transition: {
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55] as const,
        times: [0, 0.5, 1],
      },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div className="standard-demo-container">
        <div className="standard-demo-element pop-element">
          <div className="demo-text">Pop</div>
        </div>
      </div>
    )
  }

  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element pop-element"
        variants={popVariants}
        animate="animate"
      >
        <div className="demo-text">Pop</div>
      </motion.div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'standard-effects__pop',
  title: 'Pop',
  description: 'Scale overshoot entrance with rotation twist and motion blur for emphasis.',
  tags: ['framer'],
}
