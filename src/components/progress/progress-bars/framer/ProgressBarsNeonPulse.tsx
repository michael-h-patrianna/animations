import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

/**
 *
 */
export function ProgressBarsNeonPulse() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.5))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="neon-pulse-container" data-animation-id="progress-bars__neon-pulse">
      <div className="neon-pulse-track">
        {/* Main Beam */}
        <m.div 
          className="neon-pulse-fill"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        >
          {/* Flicker effect overlay */}
          <m.div 
             className="neon-pulse-flicker"
             animate={{ opacity: [1, 0.8, 1, 0.4, 1, 0.9, 1] }}
             transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
          />
        </m.div>
        
        {/* Glow Layer (Behind) */}
        <m.div 
          className="neon-pulse-glow"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        />
      </div>
      <div className="neon-pulse-label">SYNCING...</div>
    </div>
  )
}
