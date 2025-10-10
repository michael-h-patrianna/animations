import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicStarBurst.css'

export function RewardBasicStarBurst() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={{ background: 'linear-gradient(135deg, #ecc3ff 0%, #ff5981 100%)', color: '#1d092f' }}>✶</div>
        <span className="pf-reward-basic__label">Star Burst</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #ecc3ff 0%, #ff5981 100%)', color: '#1d092f' }}
        animate={{
          scale: [0.7, 1.22, 1],
          opacity: [0.8, 1, 1],
        }}
        transition={{
          duration: 0.32,
          ease: [0.175, 0.885, 0.32, 1.275],
          times: [0, 0.6, 1],
        }}
      >
        ✶
      </motion.div>
      <span className="pf-reward-basic__label">Star Burst</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__star-burst',
  title: 'Star Burst',
  description: 'Reward flourish: star burst.',
  tags: ['framer'],
}
