import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './LoadingStatesRingMulti.css'

export function LoadingStatesRingMulti() {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) {
    return (
      <div data-animation-id="loading-states__ring-multi" className="pf-loading-container">
        <div className="pf-ring-multi">
          <span className="pf-ring-multi__segment"></span>
          <span className="pf-ring-multi__segment"></span>
          <span className="pf-ring-multi__segment"></span>
        </div>
      </div>
    )
  }
  return (
    <div data-animation-id="loading-states__ring-multi" className="pf-loading-container">
      <div className="pf-ring-multi">
        <motion.span
          className="pf-ring-multi__segment"
          style={{ x: '-50%', y: '-50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' as const }}
        />
        <motion.span
          className="pf-ring-multi__segment"
          style={{ x: '-50%', y: '-50%' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' as const }}
        />
        <motion.span
          className="pf-ring-multi__segment"
          style={{ x: '-50%', y: '-50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' as const }}
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__ring-multi',
  title: 'Multi Ring',
  description: 'Nested rings oscillate asynchronously.',
  tags: ['framer']
} satisfies AnimationMetadata
