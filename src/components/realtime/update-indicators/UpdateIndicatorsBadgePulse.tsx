import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './UpdateIndicatorsBadgePulse.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'update-indicators__badge-pulse',
  title: 'Badge Pulse',
  description: 'Badge pulsates to signal unseen content.',
  tags: ['framer']
}

export function UpdateIndicatorsBadgePulse() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pulse">
        <div className="pf-update-indicator__icon"></div>
        <div className="pf-update-indicator__copy">Content update arrived</div>
        <div className="pf-update-indicator__badge">New</div>
      </div>
    )
  }

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pulse">
      <div className="pf-update-indicator__icon"></div>
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <motion.div
        className="pf-update-indicator__badge"
        animate={{
          boxShadow: [
            '0 0 0 rgba(236, 195, 255, 0)',
            '0 0 18px rgba(236, 195, 255, 0.4)',
            '0 0 0 rgba(236, 195, 255, 0)'
          ]
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop'
        }}
      >
        New
      </motion.div>
    </div>
  )
}
