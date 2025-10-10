import { motion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './shared.css'

export function StandardEffectsRubberBand() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element"
        animate={{
          scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
          scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
          times: [0, 0.3, 0.4, 0.5, 0.65, 0.75, 1],
        }}
      >
        <div className="demo-text">RubberBand</div>
      </motion.div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__rubber-band',
  title: 'Rubber Band',
  description: 'Elastic stretch with thickness variation and edge vibration for springy motion.',
  tags: ['framer'],
}
