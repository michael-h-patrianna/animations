import { useEffect, useRef, useState } from 'react'
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
  const [count, setCount] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const numberWrapperRef = useRef<HTMLDivElement>(null)
  const particleRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    // Start counting animation
    const startTime = performance.now()
    const duration = 2500
    const delay = 0

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime - delay
      if (elapsed < 0) {
        requestAnimationFrame(animateCount)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out [0, 0.65, 0.35, 1]
      const eased = 1 - Math.pow(1 - progress, 3)

      const newCount = Math.round(eased * 240)
      setCount(newCount)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    requestAnimationFrame(animateCount)

    // Number pop animation
    if (numberWrapperRef.current) {
      numberWrapperRef.current.animate(
        [
          { transform: 'scale(0.3) translateY(20px)', opacity: 0 },
          { transform: 'scale(1.15) translateY(-5px)', opacity: 1 },
          { transform: 'scale(1) translateY(0)', opacity: 1 },
        ],
        {
          duration: 1600,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    }

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

      // Animate particles
      setTimeout(() => {
        newParticles.forEach((particle) => {
          const el = particleRefs.current.get(particle.id)
          if (!el) return

          el.animate(
            [
              { opacity: 0, transform: 'translate(0, 0) scale(0)' },
              { opacity: 1, transform: `translate(${particle.x}px, ${particle.y}px) scale(1)` },
              { opacity: 0, transform: `translate(${particle.x * 1.5}px, ${particle.y * 1.5 - 40}px) scale(0.7)` },
            ],
            {
              duration: 2600,
              delay: particle.delay * 1000,
              easing: 'ease-out',
              fill: 'forwards',
            }
          )
        })
      }, 10)

      // Clear particles after animation
      setTimeout(() => setParticles([]), 3000)
    }, 400)
  }, [])

  return (
    <div className="xp-pop-container" data-animation-id="text-effects__xp-number-pop">
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          ref={(el) => {
            if (el) particleRefs.current.set(particle.id, el)
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
            opacity: 0,
          }}
        >
          +{particle.value}
        </div>
      ))}

      {/* Main number with XP label */}
      <div ref={numberWrapperRef} className="number-wrapper xp-pop-number-wrapper" style={{ opacity: 0 }}>
        <span className="xp-pop-number-value">
          +{count}
        </span>
        <span className="xp-pop-label">
          XP
        </span>
      </div>
    </div>
  )
}

