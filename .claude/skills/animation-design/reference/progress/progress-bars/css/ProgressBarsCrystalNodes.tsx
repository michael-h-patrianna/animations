import { useEffect, useState } from 'react'
import './ProgressBarsCrystalNodes.css'

export function ProgressBarsCrystalNodes() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.4))
    }, 40)
    return () => clearInterval(interval)
  }, [])

  const crystals = [20, 40, 60, 80]

  return (
    <div className="crystal-nodes-container-css" data-animation-id="progress-bars__crystal-nodes">
      <div className="crystal-track-css">
        {/* Background glow for track */}
        <div 
           className="crystal-track-fill-css"
           style={{ width: `${progress}%` }}
        />
        
        {crystals.map((pos) => {
          const isActive = progress >= pos
          return (
            <div 
               key={pos} 
               className="crystal-wrapper-css"
               style={{ left: `${pos}%` }}
            >
               <div className={`crystal-shape-css ${isActive ? 'charged' : ''}`} />
               {isActive && (
                  <div className="crystal-burst-css" />
               )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
