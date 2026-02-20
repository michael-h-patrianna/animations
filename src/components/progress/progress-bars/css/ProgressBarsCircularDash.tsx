import { useEffect, useState } from 'react'
import './ProgressBarsCircularDash.css'

/**
 *
 */
export function ProgressBarsCircularDash() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const segments = 12
  const activeSegments = Math.floor((progress / 100) * segments)

  return (
    <div className="circular-dash-container-css" data-animation-id="progress-bars__circular-dash">
      <div className="circular-dash-wrapper-css">
         {Array.from({ length: segments }).map((_, i) => {
           return (
             <div 
                key={i} 
                className="circular-dash-segment-container-css"
                style={{ 
                   transform: `rotate(${(i / segments) * 360}deg)` 
                }}
             >
               <div 
                 className="circular-dash-pill-css"
                 style={{ 
                    opacity: i < activeSegments ? 1 : 0.2,
                    backgroundColor: i < activeSegments ? 'var(--pf-anim-blue-dark)' : 'var(--pf-anim-slate)'
                 }}
               />
             </div>
           )
         })}
         <div className="circular-dash-center-css">
            {Math.round(progress)}%
         </div>
      </div>
    </div>
  )
}
