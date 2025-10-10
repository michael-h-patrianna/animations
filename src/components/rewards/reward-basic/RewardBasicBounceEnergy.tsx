import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicBounceEnergy.css'

export function RewardBasicBounceEnergy() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={{ background: 'linear-gradient(135deg, #c6ff77 0%, #47fff4 100%)', color: '#1d092f' }}>⬤</div>
        <span className="pf-reward-basic__label">Energetic Bounce</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #c6ff77 0%, #47fff4 100%)', color: '#1d092f' }}
        animate={{
          translateY: [0, -18, 0],
          scale: [1, 1.15, 1],
          rotate: [-6, 4, 0],
        }}
        transition={{
          duration: 0.32,
          ease: [0.175, 0.885, 0.32, 1.275],
          times: [0, 0.5, 1],
        }}
      >
        ⬤
      </motion.div>
      <span className="pf-reward-basic__label">Energetic Bounce</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__bounce-energy',
  title: 'Bounce Energy',
  description: 'Reward flourish: energetic bounce.',
  tags: ['framer'],
}
