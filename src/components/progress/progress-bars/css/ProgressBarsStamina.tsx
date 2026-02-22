import { staminaCrystal } from '@/assets'
import { useEffect, useState } from 'react'
import './ProgressBarsStamina.css'

const segmentCount = 14

/**
 *
 */
export function ProgressBarsStamina() {
  const [stamina, setStamina] = useState(100)
  const [isDraining, setIsDraining] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setStamina((value) => {
        if (isDraining) {
          const nextValue = Math.max(0, value - 1.05)
          if (nextValue === 0) {
            setIsDraining(false)
          }
          return nextValue
        }

        const nextValue = Math.min(100, value + 1.85)
        if (nextValue === 100) {
          setIsDraining(true)
        }
        return nextValue
      })
    }, 52)

    return () => clearInterval(interval)
  }, [isDraining])

  const isLow = stamina < 25

  return (
    <div className="stamina-wrap-css" data-animation-id="progress-bars__stamina">
      <div className="stamina-head-css">
        <div className="stamina-icon-shell-css">
          <img className={`stamina-icon-css ${isLow ? 'low' : ''}`} src={staminaCrystal} alt="" />
        </div>

        <div className="stamina-stats-css">
          <span className="stamina-title-css">Stamina</span>
          <span className={`stamina-mode-css ${isDraining ? 'drain' : 'charge'}`}>
            {isDraining ? 'Drain' : 'Recharge'}
          </span>
        </div>

        <span className="stamina-number-css">{Math.round(stamina)}</span>
      </div>

      <div className="stamina-bar-css">
        <div
          className={`stamina-bar-fill-css ${isLow ? 'low' : ''} ${isDraining ? 'drain' : 'charge'}`}
          style={{ width: `${stamina}%` }}
        />

        <div className="stamina-bar-segments-css">
          {Array.from({ length: segmentCount }, (_, index) => {
            const threshold = ((index + 1) / segmentCount) * 100
            const isActive = stamina >= threshold

            return <span key={threshold} className={`stamina-bar-segment-css ${isActive ? 'active' : ''}`} />
          })}
        </div>
      </div>
    </div>
  )
}
