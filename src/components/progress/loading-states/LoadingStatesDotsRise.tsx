import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesDotsRise.css'

export function LoadingStatesDotsRise() {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) {
    return (
      <div data-animation-id="loading-states__dots-rise" className="pf-loading-container">
        <div className="pf-dots pf-dots-rise">
          <span></span><span></span><span></span>
        </div>
      </div>
    )
  }
  return (
    <div data-animation-id="loading-states__dots-rise" className="pf-loading-container">
      <div className="pf-dots pf-dots-rise">
        {[0, 1, 2].map(i => (
          <motion.span key={i} animate={{ y: [0, -16, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__dots-rise',
  title: 'Dots Rise',
  description: 'Three-dot rise cadence for subtle loading feedback.',
  tags: ['framer']
} satisfies AnimationMetadata
