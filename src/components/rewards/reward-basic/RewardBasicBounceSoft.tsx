import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicBounceSoft.css'

export function RewardBasicBounceSoft() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={{ background: 'linear-gradient(135deg, #ffb3c6 0%, #c83558 100%)', color: '#ffffff' }}>⬤</div>
        <span className="pf-reward-basic__label">Soft Bounce</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #ffb3c6 0%, #c83558 100%)', color: '#ffffff' }}
        animate={{
          translateY: [0, -10, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 0.32,
          ease: [0.12, 0.75, 0.4, 1],
          times: [0, 0.5, 1],
        }}
      >
        ⬤
      </motion.div>
      <span className="pf-reward-basic__label">Soft Bounce</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__bounce-soft',
  title: 'Bounce Soft',
  description: 'Reward flourish: soft bounce.',
  tags: ['framer'],
}
