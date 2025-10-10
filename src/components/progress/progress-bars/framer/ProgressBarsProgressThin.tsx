import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import './ProgressBarsProgressThin.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-thin',
  title: 'Thin Glide',
  description: 'Slim tracker for compact UI contexts.',
  tags: ['framer'],
}

export function ProgressBarsProgressThin() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div
        className="pf-progress-demo pf-progress-thin"
        data-animation-id="progress-bars__progress-thin"
      >
        <div className="pf-progress-demo__label">Level progress</div>
        <div className="track-container" style={{ position: 'relative' }}>
          <div className="pf-progress-track" style={{ height: '2px' }}>
            <div className="pf-progress-fill" style={{ transform: 'scaleX(1)', transformOrigin: 'left center' }} />
          </div>
        </div>
      </div>
    )
  }

  const duration = 1.2

  const fillVariants = {
    hidden: { scaleX: 0, opacity: 0.3 },
    visible: {
      scaleX: [0, 0.3, 0.7, 1],
      opacity: [0.3, 0.6, 0.8, 1],
      transition: {
        duration,
        times: [0, 0.3, 0.7, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const photonVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: [0, 0, 1, 0.5, 0],
      x: [20, 20, 0, -10, -20],
      transition: {
        duration,
        times: [0, 0.2, 0.5, 0.9, 1],
        ease: easeOut,
      },
    },
  }

  const haloVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0, 0.5, 0.3, 0],
      transition: {
        duration,
        times: [0, 0.3, 0.6, 0.9, 1],
        ease: easeOut,
      },
    },
  }

  const dotVariants = (delay: number) => ({
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      transition: {
        duration: 0.4,
        times: [0, 0.3, 1],
        delay: duration * 0.3 + delay,
        ease: easeOut,
      },
    },
  })

  const flashVariants = {
    hidden: { opacity: 0, scaleX: 0.8 },
    visible: {
      opacity: [0, 1, 0],
      scaleX: [0.8, 1, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.3, 1],
        delay: duration,
        ease: easeOut,
      },
    },
  }

  return (
    <div
      className="pf-progress-demo pf-progress-thin"
      data-animation-id="progress-bars__progress-thin"
    >
      <div className="pf-progress-demo__label">Level progress</div>
      <motion.div
        className="track-container"
        style={{ position: 'relative' }}
        initial="hidden"
        animate="visible"
      >
        {/* Halo */}
        <motion.div
          variants={haloVariants}
          style={{
            position: 'absolute',
            inset: '-8px',
            background: 'radial-gradient(ellipse at right center, rgba(198,255,119,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
            transform: 'scale(1.3)',
          }}
        />

        <div className="pf-progress-track" style={{ height: '2px' }}>
          <motion.div
            className="pf-progress-fill"
            variants={fillVariants}
            style={{
              transformOrigin: 'left center',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            {/* Photon trail */}
            <motion.div
              variants={photonVariants}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '60px',
                height: '1px',
                background:
                  'linear-gradient(90deg, rgba(198,255,119,0) 0%, rgba(198,255,119,0.6) 50%, rgba(198,255,119,1) 100%)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        </div>

        {/* Pulse dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants(i * 0.1)}
            style={{
              position: 'absolute',
              left: `${30 + i * 25}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '4px',
              height: '4px',
              background: 'rgba(198,255,119,0.8)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Completion flash */}
        <motion.div
          variants={flashVariants}
          style={{
            position: 'absolute',
            inset: '-4px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(198,255,119,0.4) 100%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </div>
  )
}
