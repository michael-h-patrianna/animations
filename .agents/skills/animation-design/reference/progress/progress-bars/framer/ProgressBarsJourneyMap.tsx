import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsJourneyMap.css'

export const metadata = {
  id: 'progress-bars__journey-map',
  title: 'Journey Map',
  description: 'Avatar travels along a path activating nodes',
  tags: ['journey', 'map', 'avatar', 'path'],
}

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
    <div className="journey-map-container" data-animation-id="progress-bars__journey-map">
      <div className="journey-map-track-bg" />
      <m.div 
        className="journey-map-track-fill" 
        style={{ width: `${progress}%` }}
      />

      {nodes.map((pos) => (
        <div 
          key={pos} 
          className={`journey-node ${progress >= pos ? 'active' : ''}`}
          style={{ left: `${pos}%` }}
        >
          <m.div 
             className="journey-node-dot"
             animate={progress >= pos ? { scale: [1, 1.3, 1], backgroundColor: '#8b5cf6' } : { scale: 1, backgroundColor: '#e5e7eb' }}
          />
          {progress >= pos && (
             <div className="journey-node-label">Map {nodes.indexOf(pos) + 1}</div>
          )}
        </div>
      ))}

      {/* Avatar */}
      <m.div 
         className="journey-avatar"
         style={{ left: `${progress}%` }}
      >
         <div className="journey-avatar-inner">🏃</div>
         <div className="journey-avatar-tooltip">{Math.floor(progress)}%</div>
      </m.div>
    </div>
  )
}
