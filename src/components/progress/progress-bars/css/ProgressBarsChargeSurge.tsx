import { useEffect, useState } from 'react'
import './ProgressBarsChargeSurge.css'

type MilestoneState = 'inactive' | 'anticipating' | 'charged'

interface SurgeWave {
  id: number
  milestoneIndex: number
}

export function ProgressBarsChargeSurge() {
  const [progress, setProgress] = useState(0)
  const [milestoneStates, setMilestoneStates] = useState<MilestoneState[]>([
    'inactive',
    'inactive',
    'inactive',
    'inactive',
    'inactive',
  ])
  const [surgeWaves, setSurgeWaves] = useState<SurgeWave[]>([])
  const [glowFlash, setGlowFlash] = useState(false)

  const milestonePositions = [0, 0.25, 0.5, 0.75, 1]
  const ANTICIPATION_THRESHOLD = 0.05

  useEffect(() => {
    const duration = 4000
    const startTime = Date.now()
    let waveIdCounter = 0

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(elapsed / duration, 1)
      setProgress(currentProgress)

      // Update milestone states
      const newStates = [...milestoneStates]
      let stateChanged = false

      milestonePositions.forEach((pos, index) => {
        const isNearMilestone = currentProgress >= pos - ANTICIPATION_THRESHOLD
        const hasReachedMilestone = currentProgress >= pos

        if (hasReachedMilestone && newStates[index] !== 'charged') {
          // Activation
          newStates[index] = 'charged'
          stateChanged = true

          // Create surge wave
          const newWave: SurgeWave = {
            id: waveIdCounter++,
            milestoneIndex: index,
          }
          setSurgeWaves((prev) => [...prev, newWave])

          // Trigger glow flash
          setGlowFlash(true)
          setTimeout(() => setGlowFlash(false), 200)

          // Remove surge wave after animation
          setTimeout(() => {
            setSurgeWaves((prev) => prev.filter((w) => w.id !== newWave.id))
          }, 700)
        } else if (isNearMilestone && !hasReachedMilestone && newStates[index] === 'inactive') {
          // Anticipation
          newStates[index] = 'anticipating'
          stateChanged = true
        }
      })

      if (stateChanged) {
        setMilestoneStates(newStates)
      }

      if (currentProgress >= 1) {
        clearInterval(intervalId)
      }
    }, 16) // ~60fps

    return () => {
      clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="pf-progress-demo pf-charge-surge-css"
      data-animation-id="progress-bars__charge-surge"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          {/* Base fill layer */}
          <div
            className="pf-progress-fill pf-progress-fill--base"
            style={{
              transform: `scaleX(${progress})`,
              transformOrigin: 'left center',
            }}
          />

          {/* Glow fill layer */}
          <div
            className="pf-progress-fill pf-progress-fill--glow"
            style={{
              transform: `scaleX(${progress})`,
              transformOrigin: 'left center',
            }}
          >
            <div className={`glow-overlay ${glowFlash ? 'flash' : ''}`} />
          </div>
        </div>

        {/* Milestone markers */}
        {milestonePositions.map((pos, i) => (
          <div
            key={i}
            className="milestone-container"
            style={{
              position: 'absolute',
              left: `${pos * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
            }}
          >
            {/* Main marker */}
            <div
              className={`milestone-marker ${milestoneStates[i]}`}
              style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(59, 130, 246, 0.8)',
                borderRadius: '50%',
              }}
            />

            {/* Surge waves */}
            {surgeWaves
              .filter((w) => w.milestoneIndex === i)
              .map((wave) => (
                <div
                  key={wave.id}
                  className="surge-wave"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid rgba(59, 130, 246, 0.8)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
