import type { AnimationMetadata } from '@/types/animation'
import { motion, easeOut } from 'framer-motion'
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

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'standard-effects__fade',
  title: 'Fade',
  description: 'Simple opacity transition from invisible to visible for smooth appearances.',
  tags: ['framer'],
}
