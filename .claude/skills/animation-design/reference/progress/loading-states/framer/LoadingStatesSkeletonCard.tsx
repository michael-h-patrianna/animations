
import * as m from 'motion/react-m'

import './LoadingStatesSkeletonCard.css'
import '../shared.css'

export function LoadingStatesSkeletonCard() {
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
  return (
    <div data-animation-id="loading-states__skeleton-card" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-card">
        <m.div
          className="pf-skeleton__line pf-skeleton__title"
          variants={shimmerVariants}
          animate="animate"
        />
        <m.div
          className="pf-skeleton__line"
          variants={shimmerVariants}
          animate="animate"
          transition={{ delay: 0.08, duration: 1.5, ease: 'linear' as const, repeat: Infinity }}
        />
        <m.div
          className="pf-skeleton__line"
          variants={shimmerVariants}
          animate="animate"
          transition={{ delay: 0.16, duration: 1.5, ease: 'linear' as const, repeat: Infinity }}
        />
        <m.div
          className="pf-skeleton__line"
          variants={shimmerVariants}
          animate="animate"
          transition={{ delay: 0.24, duration: 1.5, ease: 'linear' as const, repeat: Infinity }}
        />
      </div>
    </div>
  )
}

