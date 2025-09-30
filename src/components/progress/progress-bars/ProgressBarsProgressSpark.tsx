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
  <div className="track-container track-container--spark">
        <div className="pf-progress-track">
          {/* Main fill bar */}
          <div ref={fillRef} className={`pf-progress-fill ${isAnimating ? 'spark-fill-anim' : ''}`} />

          {/* Trail gradient overlay */}
          <div className={`spark-trail-gradient ${isAnimating ? 'spark-trail-anim' : ''}`} />

          {/* Spark leader */}
          <div ref={sparkLeaderRef} className={`spark-leader ${isAnimating ? 'spark-leader-anim' : ''}`}>
            {/* Spark core */}
            <div className={`spark-core ${isAnimating ? 'spark-core-anim' : ''}`} />

            {/* Spark halo */}
            <div className={`spark-halo ${isAnimating ? 'spark-halo-anim' : ''}`} />
          </div>

          {/* Trailing particles */}
          <div className="trailing-particles">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className={`spark-particle ${particle.animating ? 'spark-particle-anim' : ''}`}
                data-left-percent={particle.left}
                aria-hidden
              />
            ))}
          </div>

          {/* Final burst */}
          <div className={`spark-final-burst ${isAnimating ? 'spark-final-burst-visible' : ''}`}>
            {isAnimating && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`spark-burst-dot dot-${i}`} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
