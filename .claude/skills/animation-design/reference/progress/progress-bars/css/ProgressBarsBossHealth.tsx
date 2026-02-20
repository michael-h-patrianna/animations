import { useEffect, useState } from 'react'
import './ProgressBarsBossHealth.css'

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
    <div className="boss-health-container-css" data-animation-id="progress-bars__boss-health">
      <div className="boss-health-frame-css">
        <div className="boss-skull-css">☠</div>
        <div className="boss-health-track-css">
           {/* Delayed Damage (Yellow/White) */}
           <div 
             className="boss-health-fill-css delay"
             style={{ width: `${delayedHealth}%` }}
           />
           
           {/* Current Health (Red) */}
           <div 
             className="boss-health-fill-css current"
             style={{ width: `${health}%` }}
           />
        </div>
      </div>
      <div className="boss-name-css">DARK OVERLORD</div>
    </div>
  )
}
