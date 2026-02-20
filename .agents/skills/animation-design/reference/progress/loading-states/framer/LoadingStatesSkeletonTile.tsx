
import * as m from 'motion/react-m'

import './LoadingStatesSkeletonTile.css'
import '../shared.css'

export function LoadingStatesSkeletonTile() {
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
    <div data-animation-id="loading-states__skeleton-tile" className="pf-loading-container">
      <div className="pf-skeleton-tile">
        {delays.map((delay, i) => (
          <m.div
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


