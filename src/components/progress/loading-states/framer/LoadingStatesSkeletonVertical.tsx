import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './LoadingStatesSkeletonVertical.css'

export function LoadingStatesSkeletonVertical() {
  const shouldReduceMotion = useReducedMotion()

  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        ease: 'linear' as const,
        repeat: Infinity,
      },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div data-animation-id="loading-states__skeleton-vertical" className="pf-loading-container">
        <div className="pf-skeleton pf-skeleton-vertical">
          <div className="pf-skeleton__line pf-skeleton-vertical-line-1"></div>
          <div className="pf-skeleton__line pf-skeleton-vertical-line-2"></div>
          <div className="pf-skeleton__line pf-skeleton-vertical-line-3"></div>
          <div className="pf-skeleton__line pf-skeleton-vertical-line-4"></div>
          <div className="pf-skeleton__line pf-skeleton-vertical-line-5"></div>
          <div className="pf-skeleton__line pf-skeleton-vertical-line-6"></div>
        </div>
      </div>
    )
  }

  const config = [
    { delay: 0, width: '90%' },
    { delay: 0.08, width: '75%' },
    { delay: 0.16, width: '85%' },
    { delay: 0.24, width: '70%' },
    { delay: 0.32, width: '95%' },
    { delay: 0.4, width: '80%' },
  ]

  return (
    <div data-animation-id="loading-states__skeleton-vertical" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-vertical">
        {config.map((item, i) => (
          <motion.div
            key={i}
            className={`pf-skeleton__line pf-skeleton-vertical-line-${i + 1}`}
            style={{ width: item.width }}
            variants={shimmerVariants}
            animate="animate"
            transition={{ delay: item.delay, duration: 1.5, ease: 'linear' as const, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__skeleton-vertical',
  title: 'Skeleton Vertical',
  description: 'Vertical skeleton stack simulating cards.',
  tags: ['framer'],
} satisfies AnimationMetadata
