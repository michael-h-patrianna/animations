import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'
import diamondImg from '@/assets/Diamonds.png'
import './RevealEffectsOrbShatter.css'

// Generate random particle trajectories
const particles = Array.from({ length: 12 }).map((_, i) => {
  const angle = (i / 12) * 360 * (Math.PI / 180)
  const dist = 100 + Math.random() * 50
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
  }
})

export function RevealEffectsOrbShatter() {
  const [isShattered, setIsShattered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsShattered(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-orb-shatter-container">
        <div className="reveal-orb-wrapper">
            {/* Initial Orb (disappears) */}
            <m.div 
                className="reveal-orb-sphere"
                initial={{ scale: 1, opacity: 1 }}
                animate={isShattered ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
            />
            
            {/* Explosion Particles */}
            {particles.map((p) => (
               <m.div
                 key={p.id}
                 className="reveal-orb-particle"
                 initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                 animate={isShattered ? { 
                    x: p.x, 
                    y: p.y, 
                    opacity: 0,
                    scale: 0
                 } : { 
                    x: 0, 
                    y: 0, 
                    opacity: 1, 
                    scale: 1 
                 }}
                 transition={{ duration: 0.6, ease: "easeOut" }}
               />
            ))}

            {/* Main Prize */}
            <m.img 
                src={diamondImg}
                className="reveal-orb-content"
                initial={{ scale: 0, opacity: 0 }}
                animate={isShattered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 250, damping: 20 }}
            />
        </div>
    </div>
  )
}
