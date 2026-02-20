import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsCircularDash.css'

export const metadata = {
  id: 'progress-bars__circular-dash',
  title: 'Circular Dash',
  description: 'Radial segmented progress indicator',
  tags: ['circular', 'radial', 'dash', 'loading'],
}

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
    <div className="circular-dash-container" data-animation-id="progress-bars__circular-dash">
      <div className="circular-dash-wrapper">
         {Array.from({ length: segments }).map((_, i) => {
           return (
             <div 
                key={i} 
                className="circular-dash-segment-container"
                style={{ 
                   transform: `rotate(${(i / segments) * 360}deg)` 
                }}
             >
               <m.div 
                 className="circular-dash-pill"
                 animate={{ 
                    opacity: i < activeSegments ? 1 : 0.2,
                    backgroundColor: i < activeSegments ? '#3b82f6' : '#94a3b8'
                 }}
               />
             </div>
           )
         })}
         <div className="circular-dash-center">
            {Math.round(progress)}%
         </div>
      </div>
    </div>
  )
}
