import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsBossHealth.css'

export const metadata = {
  id: 'progress-bars__boss-health',
  title: 'Boss Health',
  description: 'Video game health bar with damage delay effect',
  tags: ['game', 'health', 'boss', 'damage'],
}

export function ProgressBarsBossHealth() {
  const [health, setHealth] = useState(100)
  const [delayedHealth, setDelayedHealth] = useState(100)

  useEffect(() => {
    // Simulate damage taking
    const interval = setInterval(() => {
      setHealth(h => {
        if (h <= 0) return 100 // Reset
        const damage = Math.floor(Math.random() * 20) + 5
        return Math.max(0, h - damage)
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Delay the white bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedHealth(health)
    }, 800)
    return () => clearTimeout(timer)
  }, [health])

  return (
    <div className="boss-health-container" data-animation-id="progress-bars__boss-health">
      <div className="boss-health-frame">
        <div className="boss-skull">☠</div>
        <div className="boss-health-track">
           {/* Background (Grey) */}
           
           {/* Delayed Damage (Yellow/White) */}
           <m.div 
             className="boss-health-fill delay"
             animate={{ width: `${delayedHealth}%` }}
             transition={{ duration: 0.5, ease: "easeOut" }}
           />
           
           {/* Current Health (Red) */}
           <m.div 
             className="boss-health-fill current"
             animate={{ width: `${health}%` }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
           />
        </div>
      </div>
      <div className="boss-name">DARK OVERLORD</div>
    </div>
  )
}
