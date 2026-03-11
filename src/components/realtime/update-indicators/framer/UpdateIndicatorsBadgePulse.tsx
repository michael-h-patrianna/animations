import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'

/**
 *
 */
export function UpdateIndicatorsBadgePulse() {
  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pulse">
      <div className="pf-update-indicator__icon"></div>
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <div className="pf-update-indicator__badge">
        <m.div
          className="pf-update-indicator__badge-glow"
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1,
            ease: easeInOut,
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
        New
      </div>
    </div>
  )
}
