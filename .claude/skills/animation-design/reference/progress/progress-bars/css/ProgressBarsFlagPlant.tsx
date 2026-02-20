import { useEffect, useState } from 'react'
import './ProgressBarsFlagPlant.css'

export function ProgressBarsFlagPlant() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.5))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const flags = [30, 60, 90]

  return (
    <div className="flag-plant-container-css" data-animation-id="progress-bars__flag-plant">
      <div className="flag-track-css">
         <div 
           className="flag-fill-css" 
           style={{ width: `${progress}%` }}
         />
         
         {flags.map(pos => {
           const isReached = progress >= pos
           return (
             <div 
               key={pos}
               className="flag-marker-css"
               style={{ left: `${pos}%` }}
             >
               <div className="flag-pole-base-css" />
               <div 
                 className={`flag-pole-css ${isReached ? 'planted' : ''}`}
               >
                  <div className="flag-cloth-css">
                     🚩
                  </div>
               </div>
             </div>
           )
         })}
      </div>
    </div>
  )
}
