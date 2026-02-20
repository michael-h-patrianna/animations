import { useEffect, useState } from 'react'
import './ProgressBarsGlitch.css'

export function ProgressBarsGlitch() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + (Math.random() * 5)))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glitch-bar-container-css" data-animation-id="progress-bars__glitch">
      <div className="glitch-bar-track-css">
        {/* Main Bar */}
        <div 
          className="glitch-bar-fill-css main"
          style={{ width: `${progress}%` }}
        />
        
        {/* RGB Split Layer 1 (Red) */}
        <div 
          className="glitch-bar-fill-css glitch-red"
          style={{ width: `${progress}%` }}
        />
        
        {/* RGB Split Layer 2 (Blue) */}
        <div 
          className="glitch-bar-fill-css glitch-blue"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="glitch-text-css">
         LOADING_ASSET_0x{Math.floor(progress).toString(16)}
      </div>
    </div>
  )
}
