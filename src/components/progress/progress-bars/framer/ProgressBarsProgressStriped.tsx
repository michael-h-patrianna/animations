import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion, useReducedMotion } from 'framer-motion'
import './ProgressBarsProgressStriped.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-striped',
  title: 'Progress Striped',
  description: 'Progress bar with animated diagonal stripes and shimmer effect.',
  tags: ['framer'],
}

export function ProgressBarsProgressStriped() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div
        className="pf-progress-demo pf-progress-striped"
        data-animation-id="progress-bars__progress-striped"
      >
        <div className="pf-progress-demo__label">Level progress</div>
        <div className="track-container">
          <div className="pf-progress-track">
            <div className="pf-progress-fill" style={{ transform: 'scaleX(1)', transformOrigin: 'left center' }}>
              <div className="stripes-container" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Generate stripe elements
  const stripeCount = 20
  const stripes = Array.from({ length: stripeCount }, (_, i) => i)

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0,
      },
    },
  }

  const fillVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.4, ease: easeInOut },
    },
  }

  const stripesContainerVariants = {
    hidden: { x: 0 },
    visible: {
      x: [0, 100],
      transition: {
        duration: 2,
        ease: 'linear' as const,
        repeat: Infinity,
      },
    },
  }

  const shimmerVariants = {
    hidden: { opacity: 0, backgroundPosition: '-100% 0' },
    visible: {
      opacity: [0, 0, 0.4, 0.4, 0],
      backgroundPosition: ['-100% 0', '-100% 0', '0% 0', '100% 0', '200% 0'],
      transition: {
        duration: 1.4,
        times: [0, 0.3, 0.5, 0.7, 1],
        ease: easeInOut,
      },
    },
  }

  return (
    <motion.div
      className="pf-progress-demo pf-progress-striped"
      data-animation-id="progress-bars__progress-striped"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="pf-progress-demo__label">Level progress</div>
      <div className="track-container">
        <div className="pf-progress-track">
          <motion.div
            className="pf-progress-fill"
            variants={fillVariants}
            style={{ transformOrigin: 'left center' }}
          >
            {/* Animated stripes */}
            <motion.div
              className="stripes-container"
              variants={stripesContainerVariants}
            >
              {stripes.map((i) => (
                <div
                  key={i}
                  className="stripe"
                  style={{
                    position: 'absolute',
                    left: `${i * 32 - 100}px`,
                    top: '-20%',
                    width: '16px',
                    height: '140%',
                    background: 'rgba(255,255,255,0.08)',
                    transform: 'rotate(-45deg)',
                  }}
                />
              ))}
            </motion.div>

            {/* Shimmer overlay */}
            <motion.div
              className="shimmer"
              variants={shimmerVariants}
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
