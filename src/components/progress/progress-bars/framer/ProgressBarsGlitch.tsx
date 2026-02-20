import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

/**
 *
 */
export function ProgressBarsGlitch() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + (Math.random() * 5)))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glitch-bar-container" data-animation-id="progress-bars__glitch">
      <div className="glitch-bar-track">
        {/* Main Bar */}
        <m.div 
          className="glitch-bar-fill main"
          style={{ width: `${progress}%` }}
        />
        
        {/* RGB Split Layer 1 (Red) */}
        <m.div 
          className="glitch-bar-fill glitch-red"
          style={{ width: `${progress}%` }}
          animate={{ 
             x: [0, -2, 2, 0],
             opacity: [0, 0.8, 0]
          }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 2 }}
        />
        
        {/* RGB Split Layer 2 (Blue) */}
        <m.div 
          className="glitch-bar-fill glitch-blue"
          style={{ width: `${progress}%` }}
          animate={{ 
             x: [0, 2, -2, 0],
             opacity: [0, 0.8, 0]
          }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 2 }}
        />
      </div>
      <div className="glitch-text">
         LOADING_ASSET_0x{Math.floor(progress).toString(16)}
      </div>
    </div>
  )
}
