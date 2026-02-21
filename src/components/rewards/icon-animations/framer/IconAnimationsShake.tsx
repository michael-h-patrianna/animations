
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'

/**
 *
 */
import { shakeIcon } from '@/assets'
/**
 *
 */
export function IconAnimationsShake() {
  return (
    <div className="icon-demo-container" data-animation-id="icon-animations__shake">
      <m.img
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
          ease: easeInOut,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }}
      />
    </div>
  )
}
