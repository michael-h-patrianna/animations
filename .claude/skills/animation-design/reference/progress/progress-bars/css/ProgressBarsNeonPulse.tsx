import { useEffect, useState } from 'react'
import './ProgressBarsNeonPulse.css'

export function ProgressBarsNeonPulse() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.5))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="neon-pulse-container-css" data-animation-id="progress-bars__neon-pulse">
      <div className="neon-pulse-track-css">
        {/* Main Beam */}
        <div 
          className="neon-pulse-fill-css"
          style={{ width: `${progress}%` }}
        >
          {/* Flicker effect overlay */}
          <div className="neon-pulse-flicker-css" />
        </div>
        
        {/* Glow Layer (Behind) */}
        <div 
          className="neon-pulse-glow-css"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="neon-pulse-label-css">SYNCING...</div>
    </div>
  )
}
