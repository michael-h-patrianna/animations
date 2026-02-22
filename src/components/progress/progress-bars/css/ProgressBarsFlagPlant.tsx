import { checkpointMarkerComplete } from '@/assets'
import { useEffect, useState } from 'react'
import './ProgressBarsFlagPlant.css'

const checkpoints = [16, 34, 52, 70, 88]

/**
 *
 */
export function ProgressBarsFlagPlant() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => (value >= 100 ? 0 : value + 0.46))
    }, 44)

    return () => clearInterval(interval)
  }, [])

  const planted = checkpoints.filter((point) => progress >= point).length

  return (
    <div className="flag-plant-wrap-css" data-animation-id="progress-bars__flag-plant">
      <div className="flag-plant-meta-css">
        <span className="flag-plant-label-css">Checkpoint Planting</span>
        <span className="flag-plant-value-css">{planted}/{checkpoints.length}</span>
      </div>

      <div className="flag-plant-bar-css">
        <div className="flag-plant-bar-base-css" />
        <div className="flag-plant-bar-fill-css" style={{ width: `${progress}%` }} />

        {checkpoints.map((point, index) => {
          const isPlanted = progress >= point

          return (
            <div
              key={point}
              className={`flag-plant-site-css ${isPlanted ? 'active' : ''}`}
              style={{ left: `${point}%` }}
            >
              <img
                className={`flag-plant-marker-css ${isPlanted ? 'active' : ''}`}
                src={checkpointMarkerComplete}
                alt=""
                style={{ animationDelay: `${index * 0.04}s` }}
              />

              {isPlanted && <span className="flag-plant-pulse-css" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
