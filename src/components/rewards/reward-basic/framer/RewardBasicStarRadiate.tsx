import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './RewardBasicStarRadiate.css'

export function RewardBasicStarRadiate() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={{ background: 'linear-gradient(135deg, #47fff4 0%, #0586ae 100%)', color: '#0b1b23' }}>✹</div>
        <span className="pf-reward-basic__label">Star Radiate</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #47fff4 0%, #0586ae 100%)', color: '#0b1b23' }}
        animate={{ rotate: [0, 36, -18, 0] }}
        transition={{
          duration: 0.42,
          ease: [0.12, 0.75, 0.4, 1] as const,
          times: [0, 0.4, 0.7, 1],
        }}
      >
        ✹
      </motion.div>
      <span className="pf-reward-basic__label">Star Radiate</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__star-radiate',
  title: 'Star Radiate',
  description: 'Reward flourish: star radiate.',
  tags: ['framer'],
}
