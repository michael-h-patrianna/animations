import { motion, easeInOut } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import '../shared.css'

export function StandardEffectsSwing() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center top' }}
        animate={{
          rotate: [0, 15, -10, 5, -2, 0],
          x: [0, 2, -1.5, 1, -0.5, 0],
        }}
        transition={{
          duration: 1,
          ease: easeInOut,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      >
        <div className="demo-text">Swing</div>
      </motion.div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__swing',
  title: 'Swing',
  description: 'Pendulum arc swing with axis rotation and momentum lean for hanging elements.',
  tags: ['framer'],
}
