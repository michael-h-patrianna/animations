import { motion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './shared.css'

export function StandardEffectsShake() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element"
        animate={{
          x: [0, -10, 10, -8, 8, -6, 6, -4, 4, -2, 0],
          rotate: [0, -1, 1, -0.8, 0.8, -0.6, 0.6, -0.4, 0.4, -0.2, 0],
          scaleX: [1, 0.98, 0.98, 0.99, 0.99, 0.995, 0.995, 1, 1, 1, 1],
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
      >
        <div className="demo-text">Shake</div>
      </motion.div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__shake',
  title: 'Shake',
  description: 'Horizontal shake with rotation wobble and scale compression for error feedback.',
  tags: ['framer'],
}
