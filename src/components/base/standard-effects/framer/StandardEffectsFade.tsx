import { easeOut, motion } from 'framer-motion'
import '../shared.css'

export function StandardEffectsFade() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element fade-element"
        initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          ease: easeOut,
        }}
      >
        <div className="demo-text">Fade</div>
      </motion.div>
    </div>
  )
}
