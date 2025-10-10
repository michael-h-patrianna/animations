import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './LoadingStatesSpinnerOrbital.css'

export function LoadingStatesSpinnerOrbital() {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) {
    return (
      <div data-animation-id="loading-states__spinner-orbital" className="pf-loading-container">
        <div className="pf-spinner-orbital">
          <span className="pf-spinner-orbital__satellite" />
          <span className="pf-spinner-orbital__ring" />
        </div>
      </div>
    )
  }
  return (
    <div data-animation-id="loading-states__spinner-orbital" className="pf-loading-container">
      <div className="pf-spinner-orbital">
        <motion.span className="pf-spinner-orbital__satellite" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' as const }} />
        <motion.span className="pf-spinner-orbital__ring" animate={{ rotate: -360, opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const }} />
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__spinner-orbital',
  title: 'Spinner Orbital',
  description: 'Orbital spinner around centre mass.',
  tags: ['framer']
} satisfies AnimationMetadata
