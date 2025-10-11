import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './ProgressBarsProgressBounce.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-bounce',
  title: 'Grow up',
  description: 'Elastic finish emphasises completion state.',
  tags: ['framer'],
}

export function ProgressBarsProgressBounce() {
const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    // Trigger particles after fill animation completes
    const timer = setTimeout(() => {
      setShowParticles(true)
    }, 1600)

    return () => clearTimeout(timer)
  }, [])
  // Main fill animation with anticipation and overshoot
  const fillVariants = {
    initial: { scaleX: 0, scaleY: 1 },
    animate: {
      scaleX: [0, 0.7, 0.7, 1.15, 0.92, 1.06, 0.97, 1.01, 1],
      scaleY: [1, 1, 0.8, 0.85, 1.08, 0.96, 1.02, 0.99, 1],
      transition: {
        duration: 1.6,
        times: [0, 0.5, 0.55, 0.7, 0.78, 0.86, 0.92, 0.96, 1],
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
  }

  // Track deformation
  const trackVariants = {
    initial: { scaleY: 1 },
    animate: {
      scaleY: [1, 1, 1.2, 0.9, 1.1, 0.95, 1],
      transition: {
        duration: 1.6,
        times: [0, 0.55, 0.7, 0.78, 0.86, 0.92, 1],
        ease: easeOut,
      },
    },
  }

  // Impact waves
  const waveVariants = (delay: number) => ({
    initial: { x: 0, scaleX: 1, opacity: 0 },
    animate: {
      x: [-10, -30],
      scaleX: [2, 0.5],
      opacity: [0, 1, 0],
      transition: {
        duration: 0.4,
        times: [0, 0.2, 1],
        delay: 1.6 * 0.7 + delay,
        ease: easeOut,
      },
    },
  })

  // Elastic overlay flash
  const elasticOverlayVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0, 1, 0],
      transition: {
        duration: 1.6,
        times: [0, 0.68, 0.72, 0.85],
        ease: easeOut,
      },
    },
  }

  // Particle animations
  const particleVariants = (angle: number, distance: number) => ({
    initial: { scale: 0, opacity: 1, x: 0, y: 0 },
    animate: {
      scale: [0, 1, 0],
      opacity: [1, 1, 0],
      x: [0, Math.cos(angle) * distance, Math.cos(angle) * distance * 1.5],
      y: [0, Math.sin(angle) * distance, Math.sin(angle) * distance * 1.5],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
        ease: [0.4, 0, 0.6, 1] as const,
      },
    },
  })

  return (
    <div
      className="pf-progress-demo pf-progress-bounce"
      data-animation-id="progress-bars__progress-bounce"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <motion.div
          className="pf-progress-track"
          variants={trackVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="pf-progress-fill"
            style={{
              transformOrigin: 'left center',
              background: 'linear-gradient(90deg, #c6ff77 0%, #d4ff9f 100%)',
              position: 'relative',
            }}
            variants={fillVariants}
            initial="initial"
            animate="animate"
          >
            {/* Elastic deformation overlay */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at right center, rgba(198,255,119,0.3) 0%, transparent 50%)',
                pointerEvents: 'none',
              }}
              variants={elasticOverlayVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        </motion.div>

        {/* Impact waves */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`wave-${i}`}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              y: '-50%',
              width: 4,
              height: '100%',
              background: `rgba(198,255,119,${0.6 - i * 0.2})`,
              pointerEvents: 'none',
            }}
            variants={waveVariants(i * 0.05)}
            initial="initial"
            animate="animate"
          />
        ))}

        {/* Celebration particles */}
        {showParticles &&
          Array.from({ length: 5 }).map((_, i) => {
            const angle = (i / 5) * Math.PI * 2
            const distance = 30 + Math.random() * 20
            return (
              <motion.div
                key={`particle-${i}`}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  width: 4,
                  height: 4,
                  background: i % 2 === 0 ? '#c6ff77' : '#a8e65c',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
                variants={particleVariants(angle, distance)}
                initial="initial"
                animate="animate"
              />
            )
          })}
      </div>
    </div>
  )
}
