import { useEffect, useState } from 'react'
import './ProgressBarsJourneyMap.css'

/**
 *
 */
export function ProgressBarsJourneyMap() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.3))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const nodes = [0, 33, 66, 100]

  return (
    <div className="journey-map-container-css" data-animation-id="progress-bars__journey-map">
      <div className="journey-map-track-bg-css" />
      <div 
        className="journey-map-track-fill-css" 
        style={{ width: `${progress}%` }}
      />

      {nodes.map((pos) => (
        <div 
          key={pos} 
          className={`journey-node-css ${progress >= pos ? 'active' : ''}`}
          style={{ left: `${pos}%` }}
        >
          <div className="journey-node-dot-css" />
          {progress >= pos && (
             <div className="journey-node-label-css">Map {nodes.indexOf(pos) + 1}</div>
          )}
        </div>
      ))}

      {/* Avatar */}
      <div 
         className="journey-avatar-css"
         style={{ left: `${progress}%` }}
      >
         <div className="journey-avatar-inner-css">🏃</div>
         <div className="journey-avatar-tooltip-css">{Math.floor(progress)}%</div>
      </div>
    </div>
  )
}
