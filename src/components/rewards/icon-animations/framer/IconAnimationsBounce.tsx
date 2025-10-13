import giftBoxImage from '@/assets/present_box.png'
import '../shared.css'

import { easeInOut, motion } from 'framer-motion'
import './IconAnimationsBounce.css'

export function IconAnimationsBounce() {
  return (
    <div className="icon-demo-container">
      <motion.img
        src={giftBoxImage}
        alt="Bouncing gift box"
        style={{ width: 120, transformOrigin: 'center bottom' }}
        animate={{
          translateY: [0, 0, -30, -40, -30, 0, 0],
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
