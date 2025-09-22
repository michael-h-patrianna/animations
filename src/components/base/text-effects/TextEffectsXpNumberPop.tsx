import {
  animate,
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import './TextEffectsXpNumberPop.css'

interface Particle {
  id: number
  x: number
  y: number
  value: number
  layer: number
  delay: number
}

export function TextEffectsXpNumberPop() {
  const glowControls = useAnimation()
  const numberControls = useAnimation()
  const [particles, setParticles] = useState<Particle[]>([])

  // Motion value for smooth counting
  const count = useMotionValue(0)
  const displayValue = useTransform(count, (latest) => `+${Math.round(latest)}`)

  useEffect(() => {
    const animateXP = async () => {
      // Start glow orb animation - burst and fade completely
      glowControls.start({
        opacity: [0, 0.8, 0.4, 0],
        scale: [0.5, 1.2, 1, 0.8],
        transition: {
          duration: 2.8,
          ease: 'easeOut',
          times: [0, 0.3, 0.6, 1],
        },
      })

      // Number pop animation
      numberControls.start({
        scale: [0.3, 1.15, 1],
        y: [20, -5, 0],
        opacity: [0, 1, 1],
        filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'],
        transition: {
          duration: 1.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          times: [0, 0.6, 1],
        },
      })

      // Animate counting with cubic ease-out
      animate(count, 240, {
        duration: 2.5,
        ease: [0, 0.65, 0.35, 1],
      })

      // Create particles after delay
      setTimeout(() => {
        const newParticles: Particle[] = []

        // Create multiple layers of particles
        for (let layer = 0; layer < 2; layer++) {
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2
            const radius = 60 + layer * 20

            newParticles.push({
              id: layer * 5 + i,
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              value: Math.round(10 + Math.random() * 30),
              layer,
              delay: layer * 0.1 + i * 0.05,
            })
          }
        }

        setParticles(newParticles)

        // Clear particles after animation
        setTimeout(() => setParticles([]), 3000)
      }, 400)
    }

    animateXP()
  }, [glowControls, numberControls, count])

  return (
    <div className="xp-pop-container" data-animation-id="text-effects__xp-number-pop">
      {/* Floating particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.7],
              x: [0, particle.x, particle.x * 1.5],
              y: [0, particle.y, particle.y * 1.5 - 40],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.6,
              delay: particle.delay,
              ease: 'easeOut',
              times: [0, 0.4, 1],
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              fontSize: particle.layer === 0 ? '18px' : '14px',
              fontWeight: '700',
              color: particle.layer === 0 ? '#c6ff77' : '#a8ff3e',
              textShadow: '0 0 10px currentColor',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            +{particle.value}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main number with XP label */}
      <motion.div
        className="number-wrapper"
        animate={numberControls}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.span
          style={{
            fontSize: '56px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #c6ff77, #a8ff3e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: `
              0 0 30px rgba(198, 255, 119, 0.8),
              0 0 60px rgba(198, 255, 119, 0.5),
              0 2px 4px rgba(0, 0, 0, 0.3)
            `,
            letterSpacing: '2px',
          }}
        >
          {displayValue}
        </motion.span>
        <span
          style={{
            fontSize: '24px',
            marginLeft: '8px',
            fontWeight: '700',
            opacity: '0.8',
            color: '#a8ff3e',
          }}
        >
          XP
        </span>
      </motion.div>
    </div>
  )
}
