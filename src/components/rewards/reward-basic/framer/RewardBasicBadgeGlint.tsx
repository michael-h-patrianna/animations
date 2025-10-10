import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import './RewardBasicBadgeGlint.css'

export function RewardBasicBadgeGlint() {
  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #ff5981 0%, #ffce1a 100%)', color: '#1d092f' }}
        animate={{
          scale: [0.94, 1.06, 1],
          opacity: [0.85, 1, 1],
        }}
        transition={{
          duration: 0.42,
          ease: [0.4, 0, 0.2, 1] as const,
          times: [0, 0.6, 1],
        }}
      >
        ★
      </motion.div>
      <span className="pf-reward-basic__label">Badge Glint</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__badge-glint',
  title: 'Badge Glint',
  description: 'Reward flourish: badge glint.',
  tags: ['framer'],
}
