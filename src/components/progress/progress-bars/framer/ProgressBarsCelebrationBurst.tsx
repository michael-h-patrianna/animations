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
 * - `--burst-track-color`    — track background
 * - `--burst-fill-color`     — fill color
 * - `--burst-marker-color`   — marker/particle color
 *
 * Files to copy: this file + ProgressBarsCelebrationBurst.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useMemo, useRef, useState, useEffect } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'

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
  const displayProgress = progress ?? 0

  const activatedSet = useMemo(
    () => new Set(milestones.flatMap((ms, i) => (displayProgress >= ms.position ? [i] : []))),
    [displayProgress, milestones]
  )

  const [particles, setParticles] = useState<Particle[]>([])
  const [burstIndices, setBurstIndices] = useState<Set<number>>(() => new Set())
  const particleIdRef = useRef(0)
  const prevActivatedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const prev = prevActivatedRef.current
    const newActivations = [...activatedSet].filter((i) => !prev.has(i))
    prevActivatedRef.current = new Set(activatedSet)

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

    const timeout = setTimeout(() => {
      const ids = new Set(newParticles.map((p) => p.id))
      setParticles((p) => p.filter((x) => !ids.has(x.id)))
      setBurstIndices((b) => {
        const next = new Set(b)
        for (const idx of newActivations) next.delete(idx)
        return next
      })
    }, 500)

    return () => clearTimeout(timeout)
  }, [activatedSet])

  return (
    <div
      className={`pf-celebration-burst${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__celebration-burst"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <m.div
            className="pf-progress-fill"
            initial={false}
            animate={{ scaleX: progress ?? 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            style={{ transformOrigin: 'left center', animation: 'none' }}
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
                className="milestone-marker"
                animate={{
                  scale: isActive ? 1 : 0.6,
                  opacity: isActive ? 1 : 0.6,
                  backgroundColor: isActive
                    ? 'var(--burst-marker-color, var(--pf-anim-purple))'
                    : 'var(--burst-marker-color, var(--pf-anim-purple-dark))',
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '2px solid var(--burst-marker-color, var(--pf-anim-purple-80))',
                  borderRadius: '50%',
                }}
              />

              {hasBurst && (
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

              {particles
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
