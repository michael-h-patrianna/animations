/**
 * Charge Surge Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsChargeSurge.css + ../SharedTypes.ts
 */
import { useRef, useState, useEffect } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
import './ProgressBarsChargeSurge.css'

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0 },
  { position: 0.25 },
  { position: 0.5 },
  { position: 0.75 },
  { position: 1 },
]

const ANTICIPATION_THRESHOLD = 0.12

type MilestoneState = 'inactive' | 'anticipating' | 'charged'
interface SurgeWave {
  id: number
  milestoneIndex: number
}

export function ProgressBarsChargeSurge({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const displayProgress = progress ?? 0
  const prevProgressRef = useRef(0)
  const chargedSetRef = useRef<Set<number>>(new Set())
  const waveIdRef = useRef(0)

  const [milestoneStates, setMilestoneStates] = useState<MilestoneState[]>(() =>
    milestones.map(() => 'inactive')
  )
  const [surgeWaves, setSurgeWaves] = useState<SurgeWave[]>([])

  useEffect(() => {
    const prev = prevProgressRef.current
    prevProgressRef.current = displayProgress

    // Reset on significant backward movement
    if (displayProgress < prev - 0.02) {
      setMilestoneStates(milestones.map(() => 'inactive'))
      setSurgeWaves([])
      chargedSetRef.current.clear()
      return
    }

    const newlyCharged: number[] = []
    const nextStates: MilestoneState[] = milestones.map((ms, i) => {
      const hasReached = displayProgress >= ms.position
      const isNear = displayProgress >= ms.position - ANTICIPATION_THRESHOLD

      if (hasReached && !chargedSetRef.current.has(i)) {
        chargedSetRef.current.add(i)
        newlyCharged.push(i)
        return 'charged'
      }
      if (hasReached && chargedSetRef.current.has(i)) {
        return 'charged'
      }
      if (isNear && !hasReached) {
        return 'anticipating'
      }
      return 'inactive'
    })

    setMilestoneStates(nextStates)

    if (newlyCharged.length > 0) {
      const newWaves = newlyCharged.map((milestoneIndex) => ({
        id: waveIdRef.current++,
        milestoneIndex,
      }))
      setSurgeWaves((p) => [...p, ...newWaves])

      // Remove waves after animation duration (0.6s)
      const ids = newWaves.map((w) => w.id)
      const t = setTimeout(() => {
        setSurgeWaves((p) => p.filter((w) => !ids.includes(w.id)))
      }, 700)
      return () => clearTimeout(t)
    }
  }, [displayProgress, milestones])

  return (
    <div
      className={`pf-charge-surge${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__charge-surge"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <div className="pf-progress-fill" style={{ transform: `scaleX(${displayProgress})` }} />
        </div>

        {milestones.map((ms, i) => {
          const state = milestoneStates[i] ?? 'inactive'
          return (
            <div
              key={i}
              className={`milestone-container${state === 'charged' ? ' is-active' : ''}${state === 'anticipating' ? ' is-anticipating' : ''}`}
              style={{
                position: 'absolute',
                left: `${ms.position * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
              }}
            >
              <div className="milestone-marker" />
              {surgeWaves
                .filter((w) => w.milestoneIndex === i)
                .map((wave) => (
                  <div key={wave.id} className="surge-wave" />
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
