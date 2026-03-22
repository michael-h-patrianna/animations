/**
 * Charge Surge Progress Bar
 *
 * Progress bar with milestone markers that show anticipation tremors
 * before activation, then release surge wave effects on crossing.
 *
 * @example
 * ```tsx
 * <ProgressBarsChargeSurge
 *   progress={0.6}
 *   milestones={[{ position: 0 }, { position: 0.5 }, { position: 1 }]}
 * />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--charge-track-color`    — track background
 * - `--charge-fill-color`     — fill color
 * - `--charge-marker-color`   — marker color
 *
 * Files to copy: this file + ProgressBarsChargeSurge.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import { useRef, useState, useEffect } from 'react'
import type { MilestoneProgressBarProps, MilestoneConfig } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'

type MilestoneState = 'inactive' | 'anticipating' | 'charged'
interface SurgeWave { id: number; milestoneIndex: number }

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0 }, { position: 0.25 }, { position: 0.5 }, { position: 0.75 }, { position: 1 },
]
const ANTICIPATION_THRESHOLD = 0.05

export function ProgressBarsChargeSurge({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const isDemo = progress === undefined
  const demoDuration = 4000
  const displayProgress = useDemoProgress(progress, { duration: demoDuration, pause: 1500 })
  const [milestoneStates, setMilestoneStates] = useState<MilestoneState[]>(
    () => milestones.map(() => 'inactive')
  )
  const [surgeWaves, setSurgeWaves] = useState<SurgeWave[]>([])
  const [glowFlash, setGlowFlash] = useState(false)
  const waveIdRef = useRef(0)
  const prevProgressRef = useRef(0)

  useEffect(() => {
    const prev = prevProgressRef.current
    prevProgressRef.current = displayProgress

    if (displayProgress < prev - 0.02) {
      setMilestoneStates(milestones.map(() => 'inactive'))
      setSurgeWaves([])
      return
    }

    const pendingTimeouts: ReturnType<typeof setTimeout>[] = []
    let stateChanged = false
    const newStates = [...milestoneStates]

    milestones.forEach((ms, i) => {
      const hasReached = displayProgress >= ms.position
      const isNear = displayProgress >= ms.position - ANTICIPATION_THRESHOLD

      if (hasReached && newStates[i] !== 'charged') {
        newStates[i] = 'charged'
        stateChanged = true
        const wave: SurgeWave = { id: waveIdRef.current++, milestoneIndex: i }
        setSurgeWaves((p) => [...p, wave])
        setGlowFlash(true)
        const t1 = setTimeout(() => setGlowFlash(false), 200)
        const t2 = setTimeout(() => setSurgeWaves((p) => p.filter((w) => w.id !== wave.id)), 700)
        pendingTimeouts.push(t1, t2)
      } else if (isNear && !hasReached && newStates[i] === 'inactive') {
        newStates[i] = 'anticipating'
        stateChanged = true
      }
    })

    if (stateChanged) setMilestoneStates(newStates)
    return () => pendingTimeouts.forEach(clearTimeout)
  }, [displayProgress, milestones, milestoneStates])

  const markerVariants = (state: MilestoneState) => {
    if (state === 'anticipating') {
      return {
        scale: [1, 1.1, 1],
        backgroundColor: 'var(--charge-marker-color)',
        transition: { scale: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const } },
      }
    }
    if (state === 'charged') {
      return {
        scale: 1,
        backgroundColor: 'var(--charge-marker-color)',
        transition: { backgroundColor: { duration: 0.2 } },
      }
    }
    return { scale: 1, backgroundColor: 'var(--charge-marker-color)' }
  }

  return (
    <div
      className={`pf-charge-surge${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__charge-surge"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <m.div
            className="pf-progress-fill pf-progress-fill--base"
            initial={isDemo ? { scaleX: 0 } : false}
            animate={isDemo
              ? { scaleX: 1, transition: { duration: demoDuration / 1000, ease: 'linear' } }
              : { scaleX: progress ?? 0 }
            }
            transition={isDemo ? undefined : { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
            style={{ transformOrigin: 'left center', animation: 'none' }}
          />
          <m.div
            className="pf-progress-fill pf-progress-fill--glow"
            initial={isDemo ? { scaleX: 0 } : false}
            animate={isDemo
              ? { scaleX: 1, transition: { duration: demoDuration / 1000, ease: 'linear' } }
              : { scaleX: progress ?? 0 }
            }
            transition={isDemo ? undefined : { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
            style={{ transformOrigin: 'left center', animation: 'none' }}
          >
            <m.div
              className="glow-overlay"
              animate={{ opacity: glowFlash ? 0.8 : 0.4 }}
              transition={{ duration: 0.2 }}
            />
          </m.div>
        </div>

        {milestones.map((ms, i) => (
          <div
            key={i}
            className="milestone-container"
            style={{
              position: 'absolute',
              left: `${ms.position * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
            }}
          >
            <m.div
              className="milestone-marker"
              animate={markerVariants(milestoneStates[i]!)}
              style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid var(--charge-marker-border)',
                borderRadius: '50%',
              }}
            />
            {surgeWaves
              .filter((w) => w.milestoneIndex === i)
              .map((wave) => (
                <m.div
                  key={wave.id}
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid var(--charge-marker-border)',
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
