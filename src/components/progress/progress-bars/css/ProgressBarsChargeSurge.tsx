/**
 * Charge Surge Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsChargeSurge.module.css + ../SharedTypes.ts
 */
import { useRef, useState, useEffect } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsChargeSurge.module.css'

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
  const waveTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const [milestoneStates, setMilestoneStates] = useState<MilestoneState[]>(() =>
    milestones.map(() => 'inactive')
  )
  const [surgeWaves, setSurgeWaves] = useState<SurgeWave[]>([])

  useEffect(() => {
    const prev = prevProgressRef.current
    prevProgressRef.current = displayProgress

    // Reset on significant backward movement (sweep cycle restart)
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

      // Remove waves after animation completes (0.6s animation + 100ms margin).
      // Timers are independent of the effect lifecycle — stored in a ref so they
      // are not canceled when displayProgress changes and the effect re-runs.
      const ids = new Set(newWaves.map((w) => w.id))
      const timer = setTimeout(() => {
        setSurgeWaves((p) => p.filter((w) => !ids.has(w.id)))
        waveTimersRef.current.delete(timer)
      }, 700)
      waveTimersRef.current.add(timer)
    }
  }, [displayProgress, milestones])

  // Clean up wave timers on unmount
  useEffect(() => {
    const timers = waveTimersRef.current
    return () => {
      for (const t of timers) clearTimeout(t)
      timers.clear()
    }
  }, [])

  return (
    <div
      className={`${styles['pf-charge-surge']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__charge-surge"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track']}>
          <div
            className={styles['pf-progress-fill']}
            role="progressbar"
            aria-valuenow={Math.round(displayProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ transform: `scaleX(${displayProgress})` }}
          />
        </div>

        {milestones.map((ms, i) => {
          const state = milestoneStates[i] ?? 'inactive'
          return (
            <div
              key={i}
              className={`${styles['milestone-container']}${state === 'charged' ? ` ${styles['is-active']}` : ''}${state === 'anticipating' ? ` ${styles['is-anticipating']}` : ''}`}
              style={{
                position: 'absolute',
                left: `${ms.position * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
              }}
            >
              <div className={styles['milestone-marker']} />
              {surgeWaves
                .filter((w) => w.milestoneIndex === i)
                .map((wave) => (
                  <div key={wave.id} className={styles['surge-wave']} />
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
