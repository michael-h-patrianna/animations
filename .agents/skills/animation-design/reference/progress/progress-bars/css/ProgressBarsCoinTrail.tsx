import { useEffect, useState } from 'react'
import './ProgressBarsCoinTrail.css'

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
    const collectedCount = coins.filter(c => progress >= c).length
    setScore(collectedCount * 10)
  }, [progress])

  return (
    <div className="coin-trail-container-css" data-animation-id="progress-bars__coin-trail">
      <div className="coin-score-css">Score: {score}</div>
      <div className="coin-track-css">
         <div 
           className="coin-fill-css" 
           style={{ width: `${progress}%` }}
         />
         
         {coins.map(pos => {
            const isCollected = progress >= pos
            return (
              <div 
                key={pos} 
                className="coin-item-wrapper-css"
                style={{ left: `${pos}%` }}
              >
                <div className={`coin-item-css ${isCollected ? 'collected' : ''}`}>
                   🟡
                </div>
                {isCollected && (
                   <div className="coin-plus-one-css">
                      +10
                   </div>
                )}
              </div>
            )
         })}
      </div>
    </div>
  )
}
