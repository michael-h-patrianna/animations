import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion, useReducedMotion } from 'framer-motion'
import './LoadingStatesSpinnerGalaxy.css'

export function LoadingStatesSpinnerGalaxy() {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) {
    return (
      <div data-animation-id="loading-states__spinner-galaxy" className="pf-loading-container">
        <div className="pf-spinner-galaxy">
          <span className="pf-spinner-galaxy__star pf-spinner-galaxy__star--primary" />
          <span className="pf-spinner-galaxy__star pf-spinner-galaxy__star--secondary" />
        </div>
      </div>
    )
  }
  return (
    <div data-animation-id="loading-states__spinner-galaxy" className="pf-loading-container">
      <motion.div
        className="pf-spinner-galaxy"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const }}
      >
        <motion.span
          className="pf-spinner-galaxy__star pf-spinner-galaxy__star--primary"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: easeInOut }}
        />
        <motion.span
          className="pf-spinner-galaxy__star pf-spinner-galaxy__star--secondary"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, ease: easeInOut, delay: 0.3 }}
        />
      </motion.div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__spinner-galaxy',
  title: 'Spinner Galaxy',
  description: 'Galaxy spinner with layered opacity twirls.',
  tags: ['framer']
} satisfies AnimationMetadata
