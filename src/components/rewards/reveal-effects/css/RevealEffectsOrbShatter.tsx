import { useState, useEffect } from 'react'
import './RevealEffectsOrbShatter.css'

// Generate random particle trajectories
import { diamondImage as diamondImg } from '@/assets'
const particles = Array.from({ length: 12 }).map((_, i) => {
  const angle = (i / 12) * 360 * (Math.PI / 180)
  const dist = 100 + Math.random() * 50
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
  }
})

/**
 *
 */
export function RevealEffectsOrbShatter() {
  const [isShattered, setIsShattered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsShattered(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-orb-shatter-container-css">
        <div className="reveal-orb-wrapper-css">
            {/* Initial Orb (disappears) */}
            <div className={`reveal-orb-sphere-css ${isShattered ? 'shattered' : ''}`} />
            
            {/* Explosion Particles */}
            {particles.map((p) => (
               <div
                 key={p.id}
                 className={`reveal-orb-particle-css ${isShattered ? 'explode' : ''}`}
                 style={{ '--tx': `${p.x}px`, '--ty': `${p.y}px` } as React.CSSProperties}
               />
            ))}

            {/* Main Prize */}
            <img 
                src={diamondImg}
                className={`reveal-orb-content-css ${isShattered ? 'visible' : ''}`}
                alt="Prize"
            />
        </div>
    </div>
  )
}
