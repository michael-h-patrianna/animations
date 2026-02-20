import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsCrystalNodes.css'

export const metadata = {
  id: 'progress-bars__crystal-nodes',
  title: 'Crystal Nodes',
  description: 'Crystals charge up with energy as progress flows',
  tags: ['crystal', 'magic', 'charge', 'milestone'],
}

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
    <div className="crystal-nodes-container" data-animation-id="progress-bars__crystal-nodes">
      <div className="crystal-track">
        {/* Background glow for track */}
        <m.div 
           className="crystal-track-fill"
           style={{ width: `${progress}%` }}
        />
        
        {crystals.map((pos) => {
          const isActive = progress >= pos
          return (
            <div 
               key={pos} 
               className="crystal-wrapper"
               style={{ left: `${pos}%` }}
            >
               <m.div 
                 className={`crystal-shape ${isActive ? 'charged' : ''}`}
                 animate={isActive ? { 
                    backgroundColor: '#06b6d4',
                    scale: [1, 1.2, 1],
                    boxShadow: '0 0 15px #06b6d4'
                 } : { 
                    backgroundColor: '#374151',
                    scale: 1,
                    boxShadow: 'none'
                 }}
                 transition={{ duration: 0.4 }}
               />
               {isActive && (
                  <m.div 
                    className="crystal-burst"
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
               )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
