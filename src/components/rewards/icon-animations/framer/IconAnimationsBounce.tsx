
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'

/**
 *
 */
import { presentBox as giftBoxImage } from '@/assets'
/**
 *
 */
export function IconAnimationsBounce() {
  return (
    <div className="icon-demo-container" data-animation-id="icon-animations__bounce">
      <m.img
        src={giftBoxImage}
        alt="Bouncing gift box"
        style={{ width: 120, transformOrigin: 'center bottom' }}
        animate={{
          translateY: [0, 0, -30, -40, -30, 0, 0, 0],
          scaleY: [1, 0.8, 1.1, 1, 0.95, 0.9, 0.95, 1],
          scaleX: [1, 1.1, 0.9, 1, 1.02, 1.05, 1.02, 1],
          rotate: [0, 0, -2, -1, 1, 0, 0, 0],
        }}
        transition={{
          duration: 0.8,
          ease: easeInOut,
          times: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 0.9, 1],
        }}
      />
    </div>
  )
}
