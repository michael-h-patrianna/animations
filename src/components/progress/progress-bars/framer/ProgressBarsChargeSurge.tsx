import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

type MilestoneState = 'inactive' | 'anticipating' | 'charged'

interface SurgeWave {
  id: number
  milestoneIndex: number
}

/**
 *
 */
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

  const fillVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: progress,
      transition: { duration: 0.1, ease: [0.4, 0.0, 0.2, 1] as const },
    },
  }

  const markerVariants = (state: MilestoneState) => {
    if (state === 'anticipating') {
      return {
        scale: [1, 1.1, 1],
        backgroundColor: 'var(--pf-anim-blue-dark)',
        transition: {
          scale: {
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        },
      }
    } else if (state === 'charged') {
      return {
        scale: 1,
        backgroundColor: 'var(--pf-anim-blue-dark)',
        transition: {
          backgroundColor: { duration: 0.2 },
        },
      }
    }
    return {
      scale: 1,
      backgroundColor: 'var(--pf-anim-blue-dark)',
    }
  }

  const surgeWaveVariants = {
    initial: {
      scale: 0.5,
      opacity: 0.8,
    },
    animate: {
      scale: 2.5,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.2, 0.8, 0.2, 1] as const,
      },
    },
  }

  const glowFillVariants = {
    normal: {
      opacity: 0.4,
    },
    flash: {
      opacity: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <div
      className="pf-progress-demo pf-charge-surge"
      data-animation-id="progress-bars__charge-surge"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          {/* Base fill layer */}
          <m.div
            className="pf-progress-fill pf-progress-fill--base"
            variants={fillVariants}
            initial="hidden"
            animate="visible"
            style={{ transformOrigin: 'left center' }}
          />

          {/* Glow fill layer */}
          <m.div
            className="pf-progress-fill pf-progress-fill--glow"
            variants={fillVariants}
            initial="hidden"
            animate="visible"
            style={{ transformOrigin: 'left center' }}
          >
            <m.div
              className="glow-overlay"
              variants={glowFillVariants}
              animate={glowFlash ? 'flash' : 'normal'}
            />
          </m.div>
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
            <m.div
              className="milestone-marker"
              animate={markerVariants(milestoneStates[i])}
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
                <m.div
                  key={wave.id}
                  className="surge-wave"
                  variants={surgeWaveVariants}
                  initial="initial"
                  animate="animate"
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
