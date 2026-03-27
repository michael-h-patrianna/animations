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
 * Files to copy: this file + ProgressBarsChargeSurge.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { useRef, useState, useEffect, useCallback } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'

type MilestoneState = 'inactive' | 'anticipating' | 'charged'
interface SurgeWave {
  id: number
  milestoneIndex: number
}

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0 },
  { position: 0.25 },
  { position: 0.5 },
  { position: 0.75 },
  { position: 1 },
]
const ANTICIPATION_THRESHOLD = 0.12

export function ProgressBarsChargeSurge({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayProgress = progress ?? 0
  const [milestoneStates, setMilestoneStates] = useState<MilestoneState[]>(() =>
    milestones.map(() => 'inactive')
  )
  const [surgeWaves, setSurgeWaves] = useState<SurgeWave[]>([])
  const [glowFlash, setGlowFlash] = useState(false)
  const waveIdRef = useRef(0)
  const prevProgressRef = useRef(0)
  const chargedSetRef = useRef<Set<number>>(new Set())

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

    // Compute new states and detect crossings directly (no ref-inside-updater)
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

    // Fire surge effects for milestones that just crossed
    if (newlyCharged.length > 0) {
      const newWaves = newlyCharged.map((milestoneIndex) => ({
        id: waveIdRef.current++,
        milestoneIndex,
      }))
      setSurgeWaves((p) => [...p, ...newWaves])
      setGlowFlash(true)
      const t = setTimeout(() => setGlowFlash(false), 200)
      return () => clearTimeout(t)
    }
  }, [displayProgress, milestones])

  const handleWaveComplete = useCallback((waveId: number) => {
    setSurgeWaves((p) => p.filter((w) => w.id !== waveId))
  }, [])

  const markerVariants = (state: MilestoneState) => {
    if (prefersReducedMotion) {
      return {
        opacity: state === 'charged' ? 1 : state === 'anticipating' ? 0.7 : 0.5,
        backgroundColor: 'var(--charge-marker-color)',
        transition: { duration: 0.1 },
      }
    }
    if (state === 'anticipating') {
      return {
        scale: [1, 1.15, 1],
        backgroundColor: 'var(--charge-marker-color)',
        transition: { scale: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const } },
      }
    }
    if (state === 'charged') {
      return {
        scale: [1.3, 1],
        backgroundColor: 'var(--charge-marker-active, var(--charge-marker-color))',
        transition: { scale: { duration: 0.25, ease: 'easeOut' as const } },
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
            initial={false}
            animate={{ scaleX: progress ?? 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.3,
              ease: [0.4, 0, 0.2, 1] as const,
            }}
            style={{ transformOrigin: 'left center', animation: 'none' }}
          />
          <m.div
            className="pf-progress-fill pf-progress-fill--glow"
            initial={false}
            animate={{ scaleX: progress ?? 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.3,
              ease: [0.4, 0, 0.2, 1] as const,
            }}
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
            {!prefersReducedMotion &&
              surgeWaves
                .filter((w) => w.milestoneIndex === i)
                .map((wave) => (
                  <m.div
                    key={wave.id}
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const }}
                    onAnimationComplete={() => handleWaveComplete(wave.id)}
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
