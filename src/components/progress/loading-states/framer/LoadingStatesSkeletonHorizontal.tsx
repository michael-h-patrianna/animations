import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import './LoadingStatesSkeletonHorizontal.css'

export function LoadingStatesSkeletonHorizontal() {
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
  const delays = [0, 0.08, 0.16, 0.24, 0.32, 0.4]

  return (
    <div data-animation-id="loading-states__skeleton-horizontal" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-horizontal">
        {delays.map((delay, i) => (
          <motion.div
            key={i}
            className="pf-skeleton__line"
            variants={shimmerVariants}
            animate="animate"
            transition={{ delay, duration: 1.5, ease: 'linear' as const, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__skeleton-horizontal',
  title: 'Skeleton Horizontal',
  description: 'Horizontal skeleton shimmer for content placeholders.',
  tags: ['framer'],
} satisfies AnimationMetadata
