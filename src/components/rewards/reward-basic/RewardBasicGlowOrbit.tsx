import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './RewardBasicGlowOrbit.css'

export function RewardBasicGlowOrbit() {
  const shouldReduceMotion = useReducedMotion()

  const bgStyle = {
    background: 'radial-gradient(circle at 50% 50%, rgba(198, 255, 119, 0.85) 0%, rgba(29, 9, 47, 0.4) 70%)',
    color: '#1d092f',
  }

  if (shouldReduceMotion) {
    return (
      <div className="pf-reward-basic">
        <div className="pf-reward-basic__icon" style={bgStyle}>◎</div>
        <span className="pf-reward-basic__label">Glow Orbit</span>
      </div>
    )
  }

  return (
    <div className="pf-reward-basic">
      <motion.div
        className="pf-reward-basic__icon"
        style={bgStyle}
        animate={{ rotate: [0, 180, 360] }}
        transition={{
          duration: 0.52,
          ease: 'linear',
          times: [0, 0.5, 1],
        }}
      >
        ◎
      </motion.div>
      <span className="pf-reward-basic__label">Glow Orbit</span>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'reward-basic__glow-orbit',
  title: 'Glow Orbit',
  description: 'Reward flourish: glow orbit.',
  tags: ['framer'],
}
