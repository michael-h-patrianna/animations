import { milestoneLockClosed, milestoneLockOpen } from '@/assets'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

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
    <div className="milestone-unlock-wrap" data-animation-id="progress-bars__milestone-unlock">
      <div className="milestone-unlock-meta">
        <span className="milestone-unlock-label">Milestone Locks</span>
        <span className="milestone-unlock-value">{unlocked}/{milestonePoints.length}</span>
      </div>

      <div className="milestone-unlock-rail">
        <div className="milestone-unlock-rail-base" />
        <m.div
          className="milestone-unlock-rail-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.18, ease: [0.24, 0.78, 0.28, 0.98] }}
        />

        {milestonePoints.map((point, index) => {
          const isUnlocked = progress >= point

          return (
            <div
              key={point}
              className={`milestone-unlock-lock ${isUnlocked ? 'open' : 'closed'}`}
              style={{ left: `${point}%` }}
            >
              <span className="milestone-unlock-lock-ring" />

              <m.img
                className="milestone-unlock-lock-icon"
                src={isUnlocked ? milestoneLockOpen : milestoneLockClosed}
                alt=""
                animate={isUnlocked ? { scale: [1, 1.07, 1], rotate: [0, -4, 4, 0] } : { scale: 1, rotate: 0 }}
                transition={isUnlocked ? { duration: 0.62, delay: index * 0.02 } : { duration: 0.18 }}
              />

              {isUnlocked && (
                <m.span
                  className="milestone-unlock-lock-wave"
                  initial={{ scale: 0.35, opacity: 0.72 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.66, ease: 'easeOut' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
