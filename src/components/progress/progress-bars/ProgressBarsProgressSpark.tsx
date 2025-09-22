import { useEffect, useRef, useState } from 'react'
import './ProgressBarsProgressSpark.css'

interface Particle {
  id: number
  left: number
  animating: boolean
}

export function ProgressBarsProgressSpark() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const fillRef = useRef<HTMLDivElement>(null)
  const sparkLeaderRef = useRef<HTMLDivElement>(null)
  const particleIdRef = useRef(0)

  useEffect(() => {
    // Start animation on mount
    setIsAnimating(true)

    // Create particles over time
    const particleInterval = setInterval(() => {
      setParticles((prev) => {
        if (prev.length >= 50) {
          clearInterval(particleInterval)
          return prev
        }
        return [
          ...prev,
          {
            id: particleIdRef.current++,
            left: (prev.length / 50) * 100,
            animating: true,
          },
        ]
      })
    }, 50)

    // Clean up particles after animation
    const cleanupTimeout = setTimeout(() => {
      setParticles([])
    }, 3500)

    return () => {
      clearInterval(particleInterval)
      clearTimeout(cleanupTimeout)
      setIsAnimating(false)
    }
  }, [])

  return (
    <div className="pf-progress-demo pf-progress-spark animate" data-animation-id="progress-bars__progress-spark">
      <span className="pf-progress-demo__label">Spark Trail Progress</span>
      <div className="track-container" style={{ position: 'relative', overflow: 'visible' }}>
        <div className="pf-progress-track">
          {/* Main fill bar */}
          <div
            ref={fillRef}
            className="pf-progress-fill"
            style={{
              animation: isAnimating
                ? 'spark-fill 2.5s cubic-bezier(0.34, 1.25, 0.64, 1) forwards'
                : 'none',
            }}
          />

          {/* Trail gradient overlay */}
          <div
            className="spark-trail-gradient"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(196, 122, 229, 0.2) 20%, rgba(215, 154, 243, 0.4) 40%, rgba(198, 255, 119, 0.6) 60%, rgba(198, 255, 119, 0.8) 80%, transparent 100%)',
              borderRadius: 'inherit',
              animation: isAnimating ? 'spark-trail 2.5s ease-out forwards' : 'none',
              pointerEvents: 'none',
            }}
          />

          {/* Spark leader */}
          <div
            ref={sparkLeaderRef}
            className="spark-leader"
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '16px',
              height: '16px',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              animation: isAnimating
                ? 'spark-leader 2.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                : 'none',
            }}
          >
            {/* Spark core */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '8px',
                height: '8px',
                background: '#ffffff',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 4px #ffffff, 0 0 8px #c6ff77',
                animation: isAnimating ? 'spark-core-pulse 0.2s ease-in-out infinite' : 'none',
              }}
            />

            {/* Spark halo */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '16px',
                height: '16px',
                background: 'radial-gradient(circle, rgba(198, 255, 119, 0.6) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%) scale(1.2)',
                opacity: 0.7,
                animation: isAnimating ? 'spark-halo-pulse 0.3s ease-in-out infinite' : 'none',
              }}
            />
          </div>

          {/* Trailing particles */}
          <div
            className="trailing-particles"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="spark-particle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${particle.left}%`,
                  width: '3px',
                  height: '3px',
                  background: 'rgba(198, 255, 119, 0.8)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 5,
                  animation: particle.animating
                    ? 'spark-particle-fade 0.8s ease-out forwards'
                    : 'none',
                }}
              />
            ))}
          </div>

          {/* Final burst */}
          <div
            className="spark-final-burst"
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              width: '40px',
              height: '40px',
              transform: 'translate(50%, -50%)',
              pointerEvents: 'none',
              opacity: isAnimating ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {isAnimating && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '4px',
                      height: '4px',
                      background: '#c6ff77',
                      borderRadius: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateX(15px)`,
                      animation: 'spark-burst 0.6s ease-out forwards',
                      animationDelay: '2.2s',
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
