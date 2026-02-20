import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

/**
 *
 */
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
    <div className="stamina-container" data-animation-id="progress-bars__stamina">
      <div className="stamina-icon">⚡</div>
      <div className="stamina-track">
        <m.div 
           className={`stamina-fill ${isLow ? 'low' : ''}`}
           style={{ width: `${stamina}%` }}
           animate={isLow ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
           transition={isLow ? { duration: 0.2, repeat: Infinity } : {}}
        />
      </div>
    </div>
  )
}
