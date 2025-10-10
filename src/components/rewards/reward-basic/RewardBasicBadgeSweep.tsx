import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicBadgeSweep.css'

export function RewardBasicBadgeSweep() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={{ background: 'linear-gradient(135deg, #4e187c 0%, #c47ae5 100%)', color: '#ffffff' }}>★</div>
        <span className="pf-reward-basic__label">Badge Sweep</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #4e187c 0%, #c47ae5 100%)', color: '#ffffff' }}
        animate={{
          translateX: [-6, 6, 0],
        }}
        transition={{
          duration: 0.42,
          ease: [0.22, 0.61, 0.36, 1],
          times: [0, 0.5, 1],
        }}
      >
        ★
      </motion.div>
      <span className="pf-reward-basic__label">Badge Sweep</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__badge-sweep',
  title: 'Badge Sweep',
  description: 'Reward flourish: badge sweep.',
  tags: ['framer'],
}
