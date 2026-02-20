import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsMilestoneUnlock.css'

export const metadata = {
  id: 'progress-bars__milestone-unlock',
  title: 'Milestone Unlock',
  description: 'Icons unlock and animate as progress passes them',
  tags: ['milestone', 'unlock', 'reward', 'gamification'],
}

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
    <div className="milestone-unlock-container" data-animation-id="progress-bars__milestone-unlock">
      <div className="milestone-unlock-track">
        <m.div 
           className="milestone-unlock-fill"
           style={{ width: `${progress}%` }}
        />
        
        {milestones.map((mValue) => {
           const isUnlocked = progress >= mValue
           return (
             <div 
                key={mValue} 
                className="milestone-node"
                style={{ left: `${mValue}%` }}
             >
               <m.div 
                 className={`milestone-icon ${isUnlocked ? 'unlocked' : 'locked'}`}
                 animate={isUnlocked ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}
                 transition={isUnlocked ? { duration: 0.5, type: "spring" } : {}}
               >
                 {isUnlocked ? '🔓' : '🔒'}
               </m.div>
               
               {isUnlocked && (
                 <m.div 
                   className="milestone-ripple"
                   initial={{ scale: 0, opacity: 0.8 }}
                   animate={{ scale: 2, opacity: 0 }}
                   transition={{ duration: 0.8 }}
                 />
               )}
             </div>
           )
        })}
      </div>
    </div>
  )
}
