import { motion } from 'framer-motion'
import '../shared.css'
import './StandardEffectsPop.css'

export function StandardEffectsPop() {
const popVariants = {
    animate: {
      scale: [0, 1.2, 1],
      rotate: [0, 5, 0],
      opacity: [0, 0.8, 1],
      transition: {
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55] as const,
        times: [0, 0.5, 1],
      },
    },
  }
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element pop-element"
        variants={popVariants}
        animate="animate"
      >
        <div className="demo-text">Pop</div>
      </motion.div>
    </div>
  )
}

