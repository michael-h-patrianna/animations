import { useEffect, useState } from 'react'
import './ProgressBarsLiquidTube.css'

export function ProgressBarsLiquidTube() {
  const [progress, setProgress] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 90 ? 10 : p + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="liquid-tube-container-css" data-animation-id="progress-bars__liquid-tube">
      <div className="liquid-tube-glass-css">
        <div 
          className="liquid-tube-fill-css"
          style={{ height: `${progress}%` }}
        >
           <div className="liquid-tube-surface-css">
             <div className="liquid-wave-css" />
           </div>
           {/* Bubbles */}
           <div className="liquid-bubble-css bubble-1" />
           <div className="liquid-bubble-css bubble-2" />
           <div className="liquid-bubble-css bubble-3" />
        </div>
      </div>
    </div>
  )
}
