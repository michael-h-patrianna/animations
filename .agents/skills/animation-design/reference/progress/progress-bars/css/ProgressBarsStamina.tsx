import { useEffect, useState } from 'react'
import './ProgressBarsStamina.css'

export function ProgressBarsStamina() {
  const [stamina, setStamina] = useState(100)
  const [isDraining, setIsDraining] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setStamina(s => {
        if (isDraining) {
          if (s <= 0) {
            setIsDraining(false)
            return 0
          }
          return s - 1
        } else {
          if (s >= 100) {
            setIsDraining(true)
            return 100
          }
          return s + 2
        }
      })
    }, 50)
    return () => clearInterval(interval)
  }, [isDraining])

  const isLow = stamina < 25

  return (
    <div className="stamina-container-css" data-animation-id="progress-bars__stamina">
      <div className="stamina-icon-css">⚡</div>
      <div className="stamina-track-css">
        <div 
           className={`stamina-fill-css ${isLow ? 'low' : ''}`}
           style={{ width: `${stamina}%` }}
        />
      </div>
    </div>
  )
}
