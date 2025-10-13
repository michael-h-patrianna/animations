import { easeInOut, motion } from 'framer-motion'
import './UpdateIndicatorsLivePing.css'

export function UpdateIndicatorsLivePing() {
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
