import { milestoneLockClosed, milestoneLockOpen } from '@/assets'
import { useEffect, useState } from 'react'
import './ProgressBarsMilestoneUnlock.css'

const milestonePoints = [18, 38, 58, 78, 94]

/**
 *
 */
export function ProgressBarsMilestoneUnlock() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => (value >= 100 ? 0 : value + 0.4))
    }, 44)

    return () => clearInterval(interval)
  }, [])

  const unlocked = milestonePoints.filter((point) => progress >= point).length

  return (
    <div className="milestone-unlock-wrap-css" data-animation-id="progress-bars__milestone-unlock">
      <div className="milestone-unlock-meta-css">
        <span className="milestone-unlock-label-css">Milestone Locks</span>
        <span className="milestone-unlock-value-css">{unlocked}/{milestonePoints.length}</span>
      </div>

      <div className="milestone-unlock-rail-css">
        <div className="milestone-unlock-rail-base-css" />
        <div className="milestone-unlock-rail-fill-css" style={{ width: `${progress}%` }} />

        {milestonePoints.map((point, index) => {
          const isUnlocked = progress >= point

          return (
            <div
              key={point}
              className={`milestone-unlock-lock-css ${isUnlocked ? 'open' : 'closed'}`}
              style={{ left: `${point}%` }}
            >
              <span className="milestone-unlock-lock-ring-css" />

              <img
                className={`milestone-unlock-lock-icon-css ${isUnlocked ? 'open' : 'closed'}`}
                src={isUnlocked ? milestoneLockOpen : milestoneLockClosed}
                alt=""
                style={{ animationDelay: `${index * 0.02}s` }}
              />

              {isUnlocked && <span className="milestone-unlock-lock-wave-css" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
