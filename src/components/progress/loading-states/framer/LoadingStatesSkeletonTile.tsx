import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './LoadingStatesSkeletonTile.css'

export function LoadingStatesSkeletonTile() {
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
      <div data-animation-id="loading-states__skeleton-tile" className="pf-loading-container">
        <div className="pf-skeleton-tile">
          <div className="pf-skeleton__tile"></div>
          <div className="pf-skeleton__tile"></div>
          <div className="pf-skeleton__tile"></div>
          <div className="pf-skeleton__tile"></div>
          <div className="pf-skeleton__tile"></div>
          <div className="pf-skeleton__tile"></div>
        </div>
      </div>
    )
  }

  const delays = [0, 0.08, 0.16, 0.24, 0.32, 0.4]

  return (
    <div data-animation-id="loading-states__skeleton-tile" className="pf-loading-container">
      <div className="pf-skeleton-tile">
        {delays.map((delay, i) => (
          <motion.div
            key={i}
            className="pf-skeleton__tile"
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
  id: 'loading-states__skeleton-tile',
  title: 'Skeleton Tile Grid',
  description: 'Grid skeleton effect for gallery loading.',
  tags: ['framer'],
} satisfies AnimationMetadata
