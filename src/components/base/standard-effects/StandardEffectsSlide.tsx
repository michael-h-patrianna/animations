import { motion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './shared.css'

export function StandardEffectsSlide() {
  return (
    <div className="standard-demo-container">
      <motion.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center left' }}
        initial={{ x: '-100%', scale: 0.8, rotate: -5, opacity: 0 }}
        animate={{ x: 0, scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: 'easeOut',
        }}
      >
        <div className="demo-text">Slide</div>
      </motion.div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'standard-effects__slide',
  title: 'Slide',
  description: 'Linear sliding motion from off-screen position for panel entrances.',
  tags: ['framer'],
}
