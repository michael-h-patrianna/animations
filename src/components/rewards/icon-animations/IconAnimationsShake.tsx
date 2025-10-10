import { motion, useReducedMotion } from 'framer-motion'
import shakeIcon from '@/assets/shake_icon.png'
import type { AnimationMetadata } from '@/types/animation'
import './IconAnimationsShake.css'

export function IconAnimationsShake() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="icon-demo-container">
        <img src={shakeIcon} alt="Shake animation" style={{ width: 120 }} />
      </div>
    )
  }

  return (
    <div className="icon-demo-container">
      <motion.img
        src={shakeIcon}
        alt="Shake animation"
        style={{ width: 120 }}
        animate={{
          translateX: [0, -10, 10, -8, 8, -6, 6, -4, 4, -2, 0],
          rotate: [0, -1, 1, -0.8, 0.8, -0.6, 0.6, -0.4, 0.4, -0.2, 0],
          scaleX: [1, 0.98, 0.98, 0.99, 0.99, 0.995, 0.995, 1, 1, 1, 1],
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }}
      />
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'icon-animations__shake',
  title: 'Shake',
  description: 'Horizontal shake with rotation wobble and scale compression for error feedback.',
  tags: ['framer'],
}
