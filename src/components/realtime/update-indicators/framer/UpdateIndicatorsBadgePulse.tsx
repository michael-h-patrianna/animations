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
      <m.div
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
          ease: easeInOut,
          repeat: Infinity,
          repeatType: 'loop'
        }}
      >
        New
      </m.div>
    </div>
  )
}
