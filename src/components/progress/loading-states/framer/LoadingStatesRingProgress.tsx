import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './LoadingStatesRingProgress.css'

export function LoadingStatesRingProgress() {
  const circumference = 2 * Math.PI * 25
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div data-animation-id="loading-states__ring-progress" className="pf-loading-container">
        <div className="pf-ring-progress">
          <svg viewBox="0 0 60 60" width="60" height="60">
            <circle cx="30" cy="30" r="25" fill="none" className="base" strokeWidth="4" />
            <circle className="pf-progress-ring" cx="30" cy="30" r="25" fill="none" stroke="#c47ae5" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${circumference}`} strokeDashoffset={`${circumference * 0.25}`} />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div data-animation-id="loading-states__ring-progress" className="pf-loading-container">
      <div className="pf-ring-progress">
        <svg viewBox="0 0 60 60" width="60" height="60">
          <circle cx="30" cy="30" r="25" fill="none" className="base" strokeWidth="4" />
          <motion.circle
            className="pf-progress-ring"
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#c47ae5"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            animate={{ strokeDashoffset: [circumference, -circumference] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' as const }}
          />
        </svg>
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__ring-progress',
  title: 'Ring Progress',
  description: 'Progress ring fills from 0 to 100%.',
  tags: ['framer']
} satisfies AnimationMetadata
