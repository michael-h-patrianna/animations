import balloonImage from '@/assets/present_box_balloon.png'
import '../shared.css'

import { easeInOut, motion } from 'framer-motion'
import './IconAnimationsFloat.css'

export function IconAnimationsFloat() {
  return (
    <div className="icon-demo-container">
      <motion.img
        src={balloonImage}
        alt="Floating balloon"
        style={{ width: 120, transformOrigin: 'center 20%' }}
        animate={{
          translateY: [0, -1.5, -3, -4.5, -6, -7.5, -9, -10.5, -12, -13, -14, -13, -12, -10.5, -9, -7.5, -6, -4.5, -3, -1.5, 0],
          translateX: [0, 1, 2, 3, 4, 5, 5.5, 5, 4, 2.5, 0, -2.5, -4, -5, -5.5, -5, -4, -3, -2, -1, 0],
          rotate: [0, -1.5, -2.5, -3, -3.5, -4, -3.5, -2.5, -1.5, -0.5, 0, 0.5, 1.5, 2.5, 3.5, 4, 3.5, 3, 2.5, 1.5, 0],
          scale: [1, 1.002, 1.004, 1.006, 1.008, 1.01, 1.012, 1.014, 1.016, 1.018, 1.02, 1.018, 1.016, 1.014, 1.012, 1.01, 1.008, 1.006, 1.004, 1.002, 1],
        }}
        transition={{
          duration: 6,
          ease: easeInOut,
          repeat: Infinity,
          times: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1],
        }}
      />
    </div>
  )
}

