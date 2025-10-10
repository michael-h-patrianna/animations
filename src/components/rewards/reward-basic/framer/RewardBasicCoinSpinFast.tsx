import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './RewardBasicCoinSpinFast.css'

export function RewardBasicCoinSpinFast() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={{ background: 'linear-gradient(135deg, #ffe066 0%, #ff9500 100%)', color: '#14021f' }}>◎</div>
        <span className="pf-reward-basic__label">Quick Coin Spin</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #ffe066 0%, #ff9500 100%)', color: '#14021f' }}
        animate={{
          rotateY: [0, 720, 720],
          scale: [0.92, 1.12, 1],
        }}
        transition={{
          duration: 0.8,
          ease: [0.175, 0.885, 0.32, 1.275] as const,
          times: [0, 0.7, 1],
        }}
      >
        ◎
      </motion.div>
      <span className="pf-reward-basic__label">Quick Coin Spin</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__coin-spin-fast',
  title: 'Coin Spin Fast',
  description: 'Reward flourish: coin spin fast.',
  tags: ['framer'],
}
