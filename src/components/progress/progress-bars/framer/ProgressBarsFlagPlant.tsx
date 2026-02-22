import { checkpointMarkerComplete } from '@/assets'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

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
    <div className="flag-plant-wrap" data-animation-id="progress-bars__flag-plant">
      <div className="flag-plant-meta">
        <span className="flag-plant-label">Checkpoint Planting</span>
        <span className="flag-plant-value">{planted}/{checkpoints.length}</span>
      </div>

      <div className="flag-plant-bar">
        <div className="flag-plant-bar-base" />
        <m.div
          className="flag-plant-bar-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.18, ease: [0.24, 0.78, 0.28, 0.98] }}
        />

        {checkpoints.map((point, index) => {
          const isPlanted = progress >= point

          return (
            <div
              key={point}
              className={`flag-plant-site ${isPlanted ? 'active' : ''}`}
              style={{ left: `${point}%` }}
            >
              <m.img
                className="flag-plant-marker"
                src={checkpointMarkerComplete}
                alt=""
                animate={
                  isPlanted
                    ? { opacity: 1, scale: [1, 1.06, 1], rotate: [0, 5, -3, 2, 0] }
                    : { opacity: 0.45, scale: 0.9, rotate: 0 }
                }
                transition={
                  isPlanted
                    ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.04 }
                    : { duration: 0.2 }
                }
              />

              {isPlanted && (
                <m.span
                  className="flag-plant-pulse"
                  initial={{ scale: 0.3, opacity: 0.74 }}
                  animate={{ scale: 1.65, opacity: 0 }}
                  transition={{ duration: 0.62, ease: 'easeOut' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
