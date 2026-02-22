import { journeyAvatarDrone, journeyDestinationBeacon } from '@/assets'
import { useEffect, useState } from 'react'
import './ProgressBarsJourneyMap.css'

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
  const travellerLeft = Math.min(98, Math.max(2, progress))

  return (
    <div className="journey-distance-wrap-css" data-animation-id="progress-bars__journey-map">
      <div className="journey-distance-meta-css">
        <span className="journey-distance-label-css">Journey Distance</span>
        <span className="journey-distance-value-css">{coveredDistance} km</span>
      </div>

      <div className="journey-distance-shell-css">
        <div className="journey-distance-rail-css">
          <div className="journey-distance-track-css" />
          <div className="journey-distance-fill-css" style={{ width: `${progress}%` }} />

          <span className="journey-distance-fill-gloss-css" />

          <div className="journey-distance-ticks-css">
            {Array.from({ length: tickCount }, (_, index) => (
              <span key={index} className="journey-distance-tick-css" />
            ))}
          </div>

          <div className="journey-distance-traveller-css" style={{ left: `${travellerLeft}%` }}>
            <span className="journey-distance-traveller-glow-css" />
            <span className="journey-distance-traveller-core-css">
              <img className="journey-distance-traveller-icon-css" src={journeyAvatarDrone} alt="" />
            </span>
          </div>
        </div>

        <div className="journey-distance-goal-css">
          <img className="journey-distance-goal-icon-css" src={journeyDestinationBeacon} alt="" />
        </div>
      </div>

      <div className="journey-distance-foot-css">
        <span>{remainingDistance} km to beacon</span>
        <span>{Math.floor(progress)}%</span>
      </div>
    </div>
  )
}
