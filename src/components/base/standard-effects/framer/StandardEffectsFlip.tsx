import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion } from 'framer-motion'
import '../shared.css'
import './StandardEffectsFlip.css'

export function StandardEffectsFlip() {
const flipVariants = {
    animate: {
      rotateY: [0, 90, 180],
      scale: [1, 0.95, 1],
      transition: {
        duration: 0.8,
        ease: easeInOut,
        times: [0, 0.4, 1],
      },
    },
  }
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element flip-element"
        variants={flipVariants}
        animate="animate"
        style={{ perspective: 400 }}
      >
        <div className="demo-text">Flip</div>
      </motion.div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'standard-effects__flip',
  title: 'Flip',
  description: 'Y-axis card flip with shadow perspective and scale change during rotation.',
  tags: ['framer'],
}
