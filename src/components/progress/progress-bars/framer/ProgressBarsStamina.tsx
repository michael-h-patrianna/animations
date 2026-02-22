import { staminaCrystal } from '@/assets'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

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
    <div className="stamina-wrap" data-animation-id="progress-bars__stamina">
      <div className="stamina-head">
        <div className="stamina-icon-shell">
          <m.img
            className="stamina-icon"
            src={staminaCrystal}
            alt=""
            animate={isLow ? { scale: [1, 1.08, 1] } : { scale: [1, 1.02, 1] }}
            transition={{ duration: isLow ? 0.5 : 1.7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="stamina-stats">
          <span className="stamina-title">Stamina</span>
          <span className={`stamina-mode ${isDraining ? 'drain' : 'charge'}`}>
            {isDraining ? 'Drain' : 'Recharge'}
          </span>
        </div>

        <span className="stamina-number">{Math.round(stamina)}</span>
      </div>

      <div className="stamina-bar">
        <m.div
          className={`stamina-bar-fill ${isLow ? 'low' : ''} ${isDraining ? 'drain' : 'charge'}`}
          animate={{ width: `${stamina}%`, opacity: isLow ? [1, 0.72, 1] : 1 }}
          transition={{
            width: { duration: 0.16, ease: [0.24, 0.78, 0.28, 0.98] },
            opacity: isLow ? { duration: 0.3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.18 },
          }}
        />

        <div className="stamina-bar-segments">
          {Array.from({ length: segmentCount }, (_, index) => {
            const threshold = ((index + 1) / segmentCount) * 100
            const isActive = stamina >= threshold

            return <span key={threshold} className={`stamina-bar-segment ${isActive ? 'active' : ''}`} />
          })}
        </div>
      </div>
    </div>
  )
}
