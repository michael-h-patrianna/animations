/**
 * Celebration Burst Progress Bar
 *
 * Progress bar with milestone markers that release particle burst effects
 * and expanding rings on activation.
 *
 * @example
 * ```tsx
 * <ProgressBarsCelebrationBurst progress={0.6} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--progress-bars-celebration-burst-bg-1` — track background
 * - `--progress-bars-celebration-burst-bg-2` — fill gradient start
 * - `--progress-bars-celebration-burst-bg-3` — fill gradient end
 * - `--burst-marker-color`                   — marker/particle color
 *
 * Files to copy: this file + ProgressBarsCelebrationBurst.module.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion, useMotionValue, animate } from 'motion/react'
import { useRef, useState, useEffect } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsCelebrationBurst.module.css'

interface Particle {
  id: number
  milestoneIndex: number
  angle: number
}

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0 },
  { position: 0.25 },
  { position: 0.5 },
  { position: 0.75 },
  { position: 1 },
]

export function ProgressBarsCelebrationBurst({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const prefersReducedMotion = useReducedMotion()
  const targetProgress = progress ?? 0
  const fillMV = useMotionValue(targetProgress)

  const [activatedSet, setActivatedSet] = useState<Set<number>>(() => new Set())
  const [particles, setParticles] = useState<Particle[]>([])
  const [burstIndices, setBurstIndices] = useState<Set<number>>(() => new Set())
  const particleIdRef = useRef(0)
  const activatedRef = useRef<Set<number>>(new Set())
  const cleanupTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  // Animate fill to target — milestones derive from the animated value
  useEffect(() => {
    if (prefersReducedMotion) {
      fillMV.set(targetProgress)
      return
    }
    const controls = animate(fillMV, targetProgress, {
      duration: 0.3,
      ease: 'linear',
    })
    return () => controls.stop()
  }, [targetProgress, fillMV, prefersReducedMotion])

  // Milestone logic driven by animated fill position
  useEffect(() => {
    function checkMilestones(current: number) {
      const newSet = new Set(milestones.flatMap((ms, i) => (current >= ms.position ? [i] : [])))
      const prev = activatedRef.current
      const newActivations = [...newSet].filter((i) => !prev.has(i))

      if (newActivations.length === 0 && newSet.size === prev.size) return

      activatedRef.current = newSet
      setActivatedSet(newSet)

      if (newActivations.length === 0) return

      const newParticles: Particle[] = []
      for (const idx of newActivations) {
        for (const angle of [0, 90, 180, 270]) {
          newParticles.push({ id: particleIdRef.current++, milestoneIndex: idx, angle })
        }
      }

      setParticles((p) => [...p, ...newParticles])
      setBurstIndices((prev) => {
        const next = new Set(prev)
        for (const idx of newActivations) next.add(idx)
        return next
      })

      const ids = new Set(newParticles.map((p) => p.id))
      const timer = setTimeout(() => {
        setParticles((p) => p.filter((x) => !ids.has(x.id)))
        setBurstIndices((b) => {
          const next = new Set(b)
          for (const idx of newActivations) next.delete(idx)
          return next
        })
        cleanupTimersRef.current.delete(timer)
      }, 500)
      cleanupTimersRef.current.add(timer)
    }

    const timers = cleanupTimersRef.current
    checkMilestones(fillMV.get())
    const unsub = fillMV.on('change', checkMilestones)
    return () => {
      unsub()
      for (const t of timers) clearTimeout(t)
      timers.clear()
    }
  }, [fillMV, milestones])

  return (
    <div
      className={`${styles['pf-celebration-burst-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__celebration-burst"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track-fm']}>
          <m.div
            className={styles['pf-progress-fill-fm']}
            role="progressbar"
            aria-valuenow={Math.round(targetProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ scaleX: fillMV, transformOrigin: 'left center' }}
          />
        </div>

        {milestones.map((ms, i) => {
          const isActive = activatedSet.has(i)
          const hasBurst = burstIndices.has(i)
          return (
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
                className={styles['milestone-marker']}
                animate={{
                  scale: isActive ? 1 : 0.6,
                  opacity: isActive ? 1 : 0.6,
                  backgroundColor: isActive
                    ? 'var(--burst-marker-color, var(--pf-anim-purple))'
                    : 'var(--burst-marker-color, var(--pf-anim-purple-dark))',
                }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.25, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '2px solid var(--burst-marker-color, var(--pf-anim-purple-80))',
                  borderRadius: '50%',
                }}
              />

              {hasBurst && !prefersReducedMotion && (
                <>
                  <m.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2, opacity: [0.6, 0] }}
                    transition={{ duration: 0.3, delay: 0.04, ease: [0.2, 0.8, 0.2, 1] as const }}
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      border: '2px solid var(--burst-marker-color, var(--pf-anim-purple-80))',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                  />
                  <m.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2, opacity: [0.6, 0] }}
                    transition={{ duration: 0.3, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] as const }}
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      border: '2px solid var(--burst-marker-color, var(--pf-anim-purple-60))',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                  />
                </>
              )}

              {!prefersReducedMotion &&
                particles
                  .filter((p) => p.milestoneIndex === i)
                  .map((particle) => {
                    const radians = (particle.angle * Math.PI) / 180
                    const distance = 30
                    return (
                      <m.div
                        key={particle.id}
                        initial={{ scale: 0.5, opacity: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0.5, 1, 0],
                          opacity: [0, 1, 0],
                          x: Math.cos(radians) * distance,
                          y: Math.sin(radians) * distance,
                        }}
                        transition={{ duration: 0.4, times: [0, 0.3, 1], ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          width: '6px',
                          height: '6px',
                          marginLeft: '-3px',
                          marginTop: '-3px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--burst-marker-color, var(--pf-anim-purple))',
                          pointerEvents: 'none',
                        }}
                      />
                    )
                  })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
