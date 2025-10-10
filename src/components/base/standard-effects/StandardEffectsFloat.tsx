import { motion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './shared.css'

export function StandardEffectsFloat() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center 20%' }}
        animate={{
          y: [0, -14, 0],
          x: [0, 5.5, 0, -5.5, 0],
          rotate: [0, -4, 0, 4, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <div className="demo-text">Float</div>
      </motion.div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__float',
  title: 'Float',
  description: 'Gentle Y-axis sine wave with subtle rotation and shadow distance changes.',
  tags: ['framer'],
}
