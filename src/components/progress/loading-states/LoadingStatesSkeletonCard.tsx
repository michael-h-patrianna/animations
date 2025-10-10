import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesSkeletonCard.css'

export function LoadingStatesSkeletonCard() {
  const shouldReduceMotion = useReducedMotion()

  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div data-animation-id="loading-states__skeleton-card" className="pf-loading-container">
        <div className="pf-skeleton pf-skeleton-card">
          <div className="pf-skeleton__line pf-skeleton__title"></div>
          <div className="pf-skeleton__line"></div>
          <div className="pf-skeleton__line"></div>
          <div className="pf-skeleton__line"></div>
        </div>
      </div>
    )
  }

  return (
    <div data-animation-id="loading-states__skeleton-card" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-card">
        <motion.div
          className="pf-skeleton__line pf-skeleton__title"
          variants={shimmerVariants}
          animate="animate"
        />
        <motion.div
          className="pf-skeleton__line"
          variants={shimmerVariants}
          animate="animate"
          transition={{ delay: 0.08, duration: 1.5, ease: 'linear', repeat: Infinity }}
        />
        <motion.div
          className="pf-skeleton__line"
          variants={shimmerVariants}
          animate="animate"
          transition={{ delay: 0.16, duration: 1.5, ease: 'linear', repeat: Infinity }}
        />
        <motion.div
          className="pf-skeleton__line"
          variants={shimmerVariants}
          animate="animate"
          transition={{ delay: 0.24, duration: 1.5, ease: 'linear', repeat: Infinity }}
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__skeleton-card',
  title: 'Skeleton Card',
  description: 'Card skeleton with layered shimmer lines.',
  tags: ['framer'],
} satisfies AnimationMetadata
