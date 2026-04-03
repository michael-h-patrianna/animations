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
 * Files to copy: this file + ProgressBarsChargeSurge.module.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion, useMotionValue, animate } from 'motion/react'
import { useRef, useState, useEffect, useCallback } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsChargeSurge.module.css'

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
  const targetProgress = progress ?? 0
  const fillMV = useMotionValue(targetProgress)
  const [milestoneStates, setMilestoneStates] = useState<MilestoneState[]>(() =>
    milestones.map(() => 'inactive')
  )
  const [surgeWaves, setSurgeWaves] = useState<SurgeWave[]>([])
  const [glowFlash, setGlowFlash] = useState(false)
  const waveIdRef = useRef(0)
  const prevProgressRef = useRef(0)
  const chargedSetRef = useRef<Set<number>>(new Set())
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const waveTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  // Animate fill bar visually — purely cosmetic, does not drive milestone logic
  useEffect(() => {
    if (prefersReducedMotion) {
      fillMV.set(targetProgress)
      return
    }
    const controls = animate(fillMV, targetProgress, {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    })
    return () => controls.stop()
  }, [targetProgress, fillMV, prefersReducedMotion])

  // Milestone charging driven by the discrete prop value, not the animated fill.
  // This prevents milestone 0 from pre-charging during the backward fill animation
  // tail, where frame-to-frame deltas fall below the backward detection threshold.
  useEffect(() => {
    const prev = prevProgressRef.current
    prevProgressRef.current = targetProgress

    // Reset on significant backward movement (sweep cycle restart)
    if (targetProgress < prev - 0.02) {
      setMilestoneStates(milestones.map(() => 'inactive'))
      setSurgeWaves([])
      chargedSetRef.current.clear()
      return
    }

    const newlyCharged: number[] = []
    const nextStates: MilestoneState[] = milestones.map((ms, i) => {
      const hasReached = targetProgress >= ms.position
      const isNear = targetProgress >= ms.position - ANTICIPATION_THRESHOLD

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

    setMilestoneStates((prev) => {
      if (prev.length === nextStates.length && prev.every((s, i) => s === nextStates[i]))
        return prev
      return nextStates
    })

    if (newlyCharged.length > 0) {
      const newWaves = newlyCharged.map((milestoneIndex) => ({
        id: waveIdRef.current++,
        milestoneIndex,
      }))
      setSurgeWaves((p) => [...p, ...newWaves])
      setGlowFlash(true)
      clearTimeout(glowTimerRef.current)
      glowTimerRef.current = setTimeout(() => setGlowFlash(false), 200)
    }
  }, [targetProgress, milestones])

  // Cleanup glow and wave timers on unmount
  useEffect(() => {
    const timers = waveTimersRef.current
    return () => {
      clearTimeout(glowTimerRef.current)
      for (const t of timers) clearTimeout(t)
      timers.clear()
    }
  }, [])

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
      className={`${styles['pf-charge-surge-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__charge-surge"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track-fm']}>
          <m.div
            className={`${styles['pf-progress-fill-fm']} ${styles['pf-progress-fill-fm--base']}`}
            role="progressbar"
            aria-label="Progress"
            aria-valuenow={Math.round(targetProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ scaleX: fillMV, transformOrigin: 'left center' }}
          />
          <m.div
            className={`${styles['pf-progress-fill-fm']} ${styles['pf-progress-fill-fm--glow']}`}
            style={{ scaleX: fillMV, transformOrigin: 'left center' }}
          >
            <m.div
              className={styles['glow-overlay']}
              animate={{ opacity: glowFlash ? 0.8 : 0.4 }}
              transition={{ duration: 0.2 }}
            />
          </m.div>
        </div>

        {milestones.map((ms, i) => (
          <div
            key={i}
            className={styles['milestone-container']}
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
              className={styles['milestone-marker']}
              animate={markerVariants(milestoneStates[i]!)}
              style={{
                position: 'absolute',
                inset: 0,
                border: '1px solid var(--charge-marker-border)',
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
                      border: '1px solid var(--charge-wave-color)',
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
