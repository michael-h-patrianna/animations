import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicGlowPulse.css'

export function RewardBasicGlowPulse() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={{ background: 'linear-gradient(135deg, #c47ae5 0%, #ecc3ff 100%)', color: '#1d092f' }}>◎</div>
        <span className="pf-reward-basic__label">Glow Pulse</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={{ background: 'linear-gradient(135deg, #c47ae5 0%, #ecc3ff 100%)', color: '#1d092f' }}
        animate={{ scale: [0.92, 1.08, 1] }}
        transition={{
          duration: 0.42,
          ease: [0.4, 0, 0.2, 1],
          times: [0, 0.5, 1],
        }}
      >
        ◎
      </motion.div>
      <span className="pf-reward-basic__label">Glow Pulse</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__glow-pulse',
  title: 'Glow Pulse',
  description: 'Reward flourish: glow pulse.',
  tags: ['framer'],
}
