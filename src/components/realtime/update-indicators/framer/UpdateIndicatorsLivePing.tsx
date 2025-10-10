import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion, useReducedMotion } from 'framer-motion'
import './UpdateIndicatorsLivePing.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'update-indicators__live-ping',
  title: 'Live Ping',
  description: 'Live indicator ping loop for streams.',
  tags: ['framer']
}

export function UpdateIndicatorsLivePing() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="pf-update-indicator" data-animation-id="update-indicators__live-ping">
        <div className="pf-update-indicator__icon"></div>
        <div className="pf-update-indicator__copy">Content update arrived</div>
        <div className="pf-update-indicator__badge">New</div>
      </div>
    )
  }

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__live-ping">
      <motion.div
        className="pf-update-indicator__icon"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [1, 0, 1]
        }}
        transition={{
          duration: 1.2,
          ease: easeInOut,
          repeat: Infinity,
          repeatType: 'loop'
        }}
      />
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <div className="pf-update-indicator__badge">New</div>
    </div>
  )
}
