import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion } from 'framer-motion'
import './ProgressBarsProgressGradient.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-gradient',
  title: 'Gradient Glide',
  description: 'Gradient sweep along the bar for premium polish.',
  tags: ['framer'],
}

export function ProgressBarsProgressGradient() {
  // Main fill animation
  const fillVariants = {
    initial: { scaleX: 0 },
    animate: {
      scaleX: 1,
      transition: {
        duration: 1.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  // Gradient sweep using background-position
  const gradientVariants = {
    initial: { backgroundPositionX: '100%' },
    animate: {
      backgroundPositionX: '0%',
      transition: {
        duration: 1.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  // Shimmer sweep
  const shimmerVariants = {
    initial: { backgroundPositionX: '-100%', opacity: 0 },
    animate: {
      backgroundPositionX: ['100%'],
      opacity: [0, 0, 1, 1, 0],
      transition: {
        duration: 1.6,
        times: [0, 0.3, 0.6, 0.9, 1],
        ease: 'linear' as const,
      },
    },
  }

  // Aurora glow animation
  const auroraVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 0, 1, 0],
      scale: [0.8, 0.8, 0.9, 0.9],
      transition: {
        duration: 1.6,
        times: [0, 0.2, 0.4, 1],
        ease: easeOut,
      },
    },
  }

  return (
    <div
      className="pf-progress-demo pf-progress-gradient"
      data-animation-id="progress-bars__progress-gradient"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        {/* Aurora effect overlay */}
        <motion.div
          style={{
            position: 'absolute',
            inset: -10,
            background: `radial-gradient(ellipse at center,
              rgba(198,98,179,0) 0%,
              rgba(198,98,179,0.2) 50%,
              rgba(198,98,179,0) 100%)`,
            pointerEvents: 'none',
          }}
          variants={auroraVariants}
          initial="initial"
          animate="animate"
        />

        <div className="pf-progress-track">
          <motion.div
            className="pf-progress-fill"
            style={{
              transformOrigin: 'left center',
              position: 'relative',
              overflow: 'visible',
              background: 'transparent',
            }}
            variants={fillVariants}
            initial="initial"
            animate="animate"
          >
            {/* Multi-layer gradient system */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, #7a9148 0%, #95b85c 25%, #a8e65c 50%, #c6ff77 75%, #d4ff9f 100%)',
                backgroundSize: '300% 100%',
                borderRadius: 'inherit',
              }}
              variants={gradientVariants}
              initial="initial"
              animate="animate"
            />

            {/* Shimmer layer */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(105deg,
                  transparent 40%,
                  rgba(255,255,255,0.7) 50%,
                  transparent 60%)`,
                backgroundSize: '200% 100%',
                pointerEvents: 'none',
              }}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
