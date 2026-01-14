import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsFlagPlant.css'

export const metadata = {
  id: 'progress-bars__flag-plant',
  title: 'Flag Plant',
  description: 'Flags are planted at specific milestones',
  tags: ['flag', 'milestone', 'achievement', 'animation'],
}

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
    <div className="flag-plant-container" data-animation-id="progress-bars__flag-plant">
      <div className="flag-track">
         <m.div 
           className="flag-fill" 
           style={{ width: `${progress}%` }}
         />
         
         {flags.map(pos => {
           const isReached = progress >= pos
           return (
             <div 
               key={pos}
               className="flag-marker"
               style={{ left: `${pos}%` }}
             >
               <div className="flag-pole-base" />
               <m.div 
                 className="flag-pole"
                 initial={{ scaleY: 0, opacity: 0 }}
                 animate={isReached ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                 style={{ transformOrigin: 'bottom center' }}
                 transition={{ type: "spring", stiffness: 200, damping: 20 }}
               >
                  <m.div 
                     className="flag-cloth"
                     animate={{ rotateY: [0, 20, 0] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                     🚩
                  </m.div>
               </m.div>
             </div>
           )
         })}
      </div>
    </div>
  )
}
