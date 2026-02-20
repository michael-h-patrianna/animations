import { useEffect, useState } from 'react'
import './ProgressBarsMilestoneUnlock.css'

export function ProgressBarsMilestoneUnlock() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.5))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const milestones = [25, 50, 75, 100]

  return (
    <div className="milestone-unlock-container-css" data-animation-id="progress-bars__milestone-unlock">
      <div className="milestone-unlock-track-css">
        <div 
           className="milestone-unlock-fill-css"
           style={{ width: `${progress}%` }}
        />
        
        {milestones.map((mValue) => {
           const isUnlocked = progress >= mValue
           return (
             <div 
                key={mValue} 
                className="milestone-node-css"
                style={{ left: `${mValue}%` }}
             >
               <div className={`milestone-icon-css ${isUnlocked ? 'unlocked' : 'locked'}`}>
                 {isUnlocked ? '🔓' : '🔒'}
               </div>
               
               {isUnlocked && (
                 <div className="milestone-ripple-css" />
               )}
             </div>
           )
        })}
      </div>
    </div>
  )
}
