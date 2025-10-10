import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicCoinSpinSoft.css'

export function RewardBasicCoinSpinSoft() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={{ background: 'linear-gradient(135deg, #ffd966 0%, #ffb300 100%)', color: '#1d092f' }}>◎</div>
        <span className="pf-reward-basic__label">Soft Coin Spin</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #ffd966 0%, #ffb300 100%)', color: '#1d092f' }}
        animate={{
          rotateY: [0, 360, 360, 360],
          scale: [0.9, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 1.2,
          ease: [0.4, 0, 0.2, 1],
          times: [0, 0.6, 0.8, 1],
        }}
      >
        ◎
      </motion.div>
      <span className="pf-reward-basic__label">Soft Coin Spin</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__coin-spin-soft',
  title: 'Coin Spin Soft',
  description: 'Reward flourish: coin spin soft.',
  tags: ['framer'],
}
