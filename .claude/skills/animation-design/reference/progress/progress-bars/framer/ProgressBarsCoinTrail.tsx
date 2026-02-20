import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsCoinTrail.css'

export const metadata = {
  id: 'progress-bars__coin-trail',
  title: 'Coin Trail',
  description: 'Coins are collected as progress bar fills',
  tags: ['coin', 'collect', 'money', 'reward'],
}

export function ProgressBarsCoinTrail() {
  const [progress, setProgress] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setScore(0)
          return 0
        }
        return p + 0.5
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  const coins = [10, 30, 50, 70, 90]

  useEffect(() => {
    // Simple score update logic based on progress for demo visual
    const collectedCount = coins.filter(c => progress >= c).length
    setScore(collectedCount * 10)
  }, [progress])

  return (
    <div className="coin-trail-container" data-animation-id="progress-bars__coin-trail">
      <div className="coin-score">Score: {score}</div>
      <div className="coin-track">
         <m.div 
           className="coin-fill" 
           style={{ width: `${progress}%` }}
         />
         
         {coins.map(pos => {
            const isCollected = progress >= pos
            return (
              <div 
                key={pos} 
                className="coin-item-wrapper"
                style={{ left: `${pos}%` }}
              >
                <m.div
                   className="coin-item"
                   animate={isCollected ? { 
                      y: -30, 
                      opacity: 0,
                      scale: 1.5 
                   } : { 
                      y: 0, 
                      opacity: 1,
                      scale: 1 
                   }}
                   transition={isCollected ? { duration: 0.6, ease: "easeOut" } : { duration: 0 }}
                >
                   🟡
                </m.div>
                {isCollected && (
                   <m.div 
                      className="coin-plus-one"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8 }}
                   >
                      +10
                   </m.div>
                )}
              </div>
            )
         })}
      </div>
    </div>
  )
}
