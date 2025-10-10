import { motion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './shared.css'

export function StandardEffectsTada() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element"
        animate={{
          scale: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
          rotate: [0, -3, -3, 3, -3, 3, -3, 3, -3, 3, 0],
          skewX: [0, -2, -2, 1, -1, 1, -1, 1, -1, 1, 0],
          opacity: [1, 0.95, 0.95, 1, 0.98, 1, 0.98, 1, 0.98, 1, 1],
        }}
        transition={{
          duration: 1,
          ease: [0.4, 0, 0.6, 1],
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }}
      >
        <div className="demo-text">Tada</div>
      </motion.div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__tada',
  title: 'Tada',
  description: 'Celebration animation combining scale and rotation for success moments.',
  tags: ['framer'],
}
