import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './LoadingStatesSpinnerDualRing.css'

export function LoadingStatesSpinnerDualRing() {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) {
    return (
      <div data-animation-id="loading-states__spinner-dual-ring" className="pf-loading-container">
        <div className="pf-spinner-dual-ring">
          <span className="pf-spinner-dual-ring__outer" /><span className="pf-spinner-dual-ring__inner" />
        </div>
      </div>
    )
  }
  return (
    <div data-animation-id="loading-states__spinner-dual-ring" className="pf-loading-container">
      <div className="pf-spinner-dual-ring">
        <motion.span className="pf-spinner-dual-ring__outer" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' as const }} />
        <motion.span className="pf-spinner-dual-ring__inner" animate={{ rotate: -360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }} />
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__spinner-dual-ring',
  title: 'Spinner Dual Ring',
  description: 'Dual ring spinner with consistent velocity.',
  tags: ['framer']
} satisfies AnimationMetadata
