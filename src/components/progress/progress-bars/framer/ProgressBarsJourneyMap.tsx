import { journeyAvatarDrone, journeyDestinationBeacon } from '@/assets'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

const totalDistance = 520
const tickCount = 22

/**
 *
 */
export function ProgressBarsJourneyMap() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => (value >= 100 ? 0 : value + 0.29))
    }, 32)

    return () => clearInterval(interval)
  }, [])

  const coveredDistance = Math.round((progress / 100) * totalDistance)
  const remainingDistance = Math.max(0, totalDistance - coveredDistance)

  return (
    <div className="journey-distance-wrap" data-animation-id="progress-bars__journey-map">
      <div className="journey-distance-meta">
        <span className="journey-distance-label">Journey Distance</span>
        <span className="journey-distance-value">{coveredDistance} km</span>
      </div>

      <div className="journey-distance-shell">
        <div className="journey-distance-rail">
          <div className="journey-distance-track" />

          <m.div
            className="journey-distance-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.18, ease: [0.24, 0.78, 0.28, 0.98] }}
          >
            <m.div
              className="journey-distance-traveller"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="journey-distance-traveller-glow" />
              <span className="journey-distance-traveller-core">
                <img className="journey-distance-traveller-icon" src={journeyAvatarDrone} alt="" />
              </span>
            </m.div>
          </m.div>

          <m.span
            className="journey-distance-fill-gloss"
            animate={{ x: ['-12%', '120%'], opacity: [0, 0.65, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="journey-distance-ticks">
            {Array.from({ length: tickCount }, (_, index) => (
              <span key={index} className="journey-distance-tick" />
            ))}
          </div>

        </div>

        <div className="journey-distance-goal">
          <img className="journey-distance-goal-icon" src={journeyDestinationBeacon} alt="" />
        </div>
      </div>

      <div className="journey-distance-foot">
        <span>{remainingDistance} km to beacon</span>
        <span>{Math.floor(progress)}%</span>
      </div>
    </div>
  )
}
