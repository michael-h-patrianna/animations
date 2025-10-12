import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './ProgressBarsXpAccumulation.css'


// Local type for milestone halo animation entries
// Local type for milestone halo animation entries
type MilestoneAnimation = { id: number; threshold: number; trophy: string }

interface FloatingXP {
  id: number
  value: number
  percent: number
  offset: number
}

const INITIAL_XP = 100
const MAX_XP = 1000
const PROGRESS_DURATION = 0.48
const ORB_IMPACT_DELAY_MS = 420
const FLOATING_SPAWN_LEAD_MS = 110
const FLOATING_LIFETIME_MS = 1650
const GAIN_INTERVAL_MS = 1580
const FIRST_GAIN_DELAY_MS = 520
const RESET_DELAY_MS = 2600
const PROGRESS_EASE: [number, number, number, number] = [0.18, 0.85, 0.25, 1]

const MULTIPLIER_ZONES = [
  { threshold: 20, multiplier: 2, trophy: '01_Trophy.png' },
  { threshold: 40, multiplier: 3, trophy: '02_Trophy.png' },
  { threshold: 60, multiplier: 4, trophy: '03_Trophy.png' },
  { threshold: 80, multiplier: 5, trophy: '04_Trophy.png' },
] as const

const STAR_IMAGES = ['01_Star.png', '03_Star.png', '05_Star.png', '07_Star.png'] as const

const XP_SEQUENCE_RANGES: Array<[number, number]> = [
  [150, 165],
  [205, 222],
  [290, 310],
  [405, 430],
  [525, 552],
  [655, 678],
  [785, 812],
  [910, 940],
  [MAX_XP, MAX_XP],
]

const MIN_SEQUENCE_STEP = 28

function createXpSequence() {
  let current = INITIAL_XP

  return XP_SEQUENCE_RANGES.map(([min, max]) => {
    const span = Math.max(0, max - min)
    const roll = span === 0 ? min : min + Math.random() * span
    const ensured = Math.max(current + MIN_SEQUENCE_STEP, roll)
    const clamped = Math.min(MAX_XP, ensured)
    current = clamped
    return clamped
  })
}

// Helper component for multiplier badge animation
function MultiplierBadge({ multiplier }: { multiplier: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { transform: 'scale(0.4)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      {
        duration: 380,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [])

  return (
    <span
      ref={ref}
      className="pf-xp-multiplier"
      style={{ transform: 'scale(0.4)', opacity: 0, willChange: 'transform, opacity' }}
    >
      x{multiplier}
    </span>
  )
}

// Helper component for marker animations
function MarkerIndicator({ isActive }: { isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { opacity: isActive ? 1 : 0.38, transform: `scaleY(${isActive ? 1 : 0.7})` }
      ],
      {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [isActive])

  return (
    <div
      ref={ref}
      className="pf-marker__indicator"
      style={{ willChange: 'opacity, transform' }}
    />
  )
}

// Helper component for marker dot animations
function MarkerDot({ isActive }: { isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { transform: `scale(${isActive ? 1 : 0.9})` }
      ],
      {
        duration: 320,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [isActive])

  return (
    <div
      ref={ref}
      className="pf-marker__dot"
      style={{ willChange: 'transform' }}
    />
  )
}

// Helper component for marker label animations
function MarkerLabel({ isActive, children }: { isActive: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { opacity: isActive ? 1 : 0.42 }
      ],
      {
        duration: 250,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [isActive])

  return (
    <span
      ref={ref}
      className="pf-marker__label"
      style={{ willChange: 'opacity' }}
    >
      {children}
    </span>
  )
}

// Helper component for milestone pulse animations
function MilestonePulse({ threshold, isBoundary }: { threshold: number; isBoundary?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { transform: 'scale(0.8)', opacity: 0.6 },
        { transform: 'scale(1.6)', opacity: 0 }
      ],
      {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [])

  return (
    <div
      ref={ref}
      key={`pulse-${threshold}`}
      className={`pf-marker__pulse${isBoundary ? ' pf-marker__pulse--boundary' : ''}`}
      style={{ willChange: 'transform, opacity' }}
    />
  )
}

// Helper component for milestone halo animations
function MilestoneHalo({ threshold }: { threshold: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { transform: 'scale(0.55)', opacity: 0.6 },
        { transform: 'scale(1.3)', opacity: 0 }
      ],
      {
        duration: 900,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [])

  return (
    <div
      ref={ref}
      key={`halo-${threshold}`}
      className="pf-marker__halo"
      style={{ willChange: 'transform, opacity' }}
    />
  )
}

// Helper component for floating XP animations
function FloatingXPDisplay({ floating }: { floating: FloatingXP }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { opacity: 0, transform: 'translateY(0px) scale(0.6)' },
        { opacity: 1, transform: 'translateY(-18px) scale(1.05)', offset: 0.28 },
        { opacity: 1, transform: 'translateY(-36px) scale(1)', offset: 0.68 },
        { opacity: 0, transform: 'translateY(-52px) scale(0.92)' }
      ],
      {
        duration: 1450,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [])

  return (
    <div
      ref={ref}
      key={floating.id}
      className="pf-floating-xp"
      style={{
        left: `calc(${Math.min(floating.percent, 100)}% + ${floating.offset}px)`,
        willChange: 'opacity, transform'
      }}
    >
      +{Math.round(floating.value)} XP
    </div>
  )
}

export function ProgressBarsXpAccumulation() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [floatingXP, setFloatingXP] = useState<FloatingXP[]>([])
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [milestoneAnimations, setMilestoneAnimations] = useState<MilestoneAnimation[]>([])
  const [progressDisplay, setProgressDisplay] = useState((INITIAL_XP / MAX_XP) * 100)
  const [displayXP, setDisplayXP] = useState(INITIAL_XP)

  // Replace Framer Motion values with plain refs and state
  const progressValueRef = useRef((INITIAL_XP / MAX_XP) * 100)
  const xpValueRef = useRef(INITIAL_XP)
  const progressFillRef = useRef<HTMLDivElement>(null)

  const xpRef = useRef(INITIAL_XP)
  const animationRef = useRef<{ orbId: number; floatingId: number; milestoneId: number }>({
    orbId: 0,
    floatingId: 0,
    milestoneId: 0,
  })
  const timeoutHandlesRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const animationControlsRef = useRef<Animation[]>([])
  const reachedMilestonesRef = useRef<Set<number>>(new Set())
  const lastProgressRef = useRef((INITIAL_XP / MAX_XP) * 100)
  const xpSequenceRef = useRef<number[]>(createXpSequence())
  const sequenceIndexRef = useRef(0)

  const multiplierZones = useMemo(() => [...MULTIPLIER_ZONES], [])
  const starImages = useMemo(() => [...STAR_IMAGES], [])

  const registerTimeout = useCallback((callback: () => void, delay: number) => {
    const handle = setTimeout(() => {
      timeoutHandlesRef.current = timeoutHandlesRef.current.filter((entry) => entry !== handle)
      callback()
    }, delay)

    timeoutHandlesRef.current.push(handle)
    return handle
  }, [])

  const registerAnimation = useCallback((control: Animation) => {
    animationControlsRef.current.push(control)
    return control
  }, [])

  const clearScheduledWork = useCallback(() => {
    timeoutHandlesRef.current.forEach(clearTimeout)
    timeoutHandlesRef.current = []
    animationControlsRef.current.forEach((control) => control.cancel())
    animationControlsRef.current = []
  }, [])

  const getRandomStar = useCallback(() => {
    const index = Math.floor(Math.random() * starImages.length)
    return starImages[index]
  }, [starImages])

  const getCurrentMultiplier = useCallback(
    (xp: number) => {
      const progressPercent = (xp / MAX_XP) * 100
      const activeZone = [...multiplierZones]
        .reverse()
        .find((zone) => progressPercent >= zone.threshold)
      return activeZone ? activeZone.multiplier : 1
    },
    [multiplierZones]
  )

  const triggerMilestone = useCallback(
    (threshold: number, trophy: string) => {
      const milestoneId = animationRef.current.milestoneId++
      setMilestoneAnimations((prev) => [...prev, { id: milestoneId, threshold, trophy }])

      registerTimeout(() => {
        setMilestoneAnimations((prev) => prev.filter((m) => m.id !== milestoneId))
      }, 2000)
    },
    [registerTimeout]
  )

  // Note: Avoid layout reads (getBoundingClientRect/clientWidth) for marker positioning;
  // we rely on pure CSS percentage-based placement relative to the track.

  // Helper function to create cubic-bezier easing
  const cubicBezier = useCallback((p1x: number, p1y: number, p2x: number, p2y: number) => {
    return `cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y})`
  }, [])

  // Custom animate function using Web Animations API
  const animateValue = useCallback(
    (
      from: number,
      to: number,
      duration: number,
      ease: [number, number, number, number],
      onUpdate: (value: number) => void,
      onComplete?: () => void
    ): Animation => {
      const element = document.createElement('div')
      const animation = element.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        {
          duration: duration * 1000,
          easing: cubicBezier(ease[0], ease[1], ease[2], ease[3]),
        }
      )

      const startTime = performance.now()
      const range = to - from

      const updateLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)

        // Manual easing approximation for the value interpolation
        const easedProgress = progress
        const currentValue = from + range * easedProgress

        onUpdate(currentValue)

        if (progress < 1) {
          requestAnimationFrame(updateLoop)
        } else {
          onComplete?.()
        }
      }

      requestAnimationFrame(updateLoop)

      return animation
    },
    [cubicBezier]
  )

  // Update progress display when progress changes
  const updateProgress = useCallback(
    (latest: number) => {
      const previous = lastProgressRef.current
      setProgressDisplay(latest)

      if (latest < previous - 1.5) {
        reachedMilestonesRef.current.clear()
        setMilestoneAnimations([])
      } else {
        multiplierZones.forEach((zone) => {
          if (
            !reachedMilestonesRef.current.has(zone.threshold) &&
            previous < zone.threshold &&
            latest >= zone.threshold
          ) {
            reachedMilestonesRef.current.add(zone.threshold)
            triggerMilestone(zone.threshold, zone.trophy)
          }
        })

        // Trigger completion milestone at 100%
        if (!reachedMilestonesRef.current.has(100) && previous < 100 && latest >= 100) {
          reachedMilestonesRef.current.add(100)
          // Trophy string unused in UI; pass empty
          triggerMilestone(100, '')
        }
      }

      lastProgressRef.current = latest
    },
    [multiplierZones, triggerMilestone]
  )

  useEffect(() => {
    const computedMultiplier = getCurrentMultiplier(displayXP)
    setCurrentMultiplier((prev) => (prev === computedMultiplier ? prev : computedMultiplier))
  }, [displayXP, getCurrentMultiplier])

  useEffect(() => {
    let stopped = false

    const resetAnimation = () => {
      clearScheduledWork()
      reachedMilestonesRef.current.clear()
      animationRef.current = { orbId: 0, floatingId: 0, milestoneId: 0 }
      xpSequenceRef.current = createXpSequence()
      sequenceIndexRef.current = 0
      xpRef.current = INITIAL_XP

      progressValueRef.current = (INITIAL_XP / MAX_XP) * 100
      xpValueRef.current = INITIAL_XP
      lastProgressRef.current = (INITIAL_XP / MAX_XP) * 100

      // Reset progress fill transform
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${(INITIAL_XP / MAX_XP) * 100 / 100})`
      }

      setFloatingXP([])
      setMilestoneAnimations([])
      setDisplayXP(INITIAL_XP)
      setProgressDisplay((INITIAL_XP / MAX_XP) * 100)
      setCurrentMultiplier(getCurrentMultiplier(INITIAL_XP))

      // Emit a subtle activation pulse for the Start marker
      registerTimeout(() => {
        triggerMilestone(0, '')
      }, 120)
    }

    const startGainLoop = () => {
      const runGain = () => {
        if (stopped) {
          return
        }

        const script = xpSequenceRef.current
        const stepIndex = sequenceIndexRef.current

        if (stepIndex >= script.length) {
          registerTimeout(() => {
            if (stopped) {
              return
            }

            resetAnimation()
            registerTimeout(runGain, FIRST_GAIN_DELAY_MS)
          }, RESET_DELAY_MS)
          return
        }

        const startingXP = xpRef.current
        const targetXP = script[stepIndex]

        if (targetXP <= startingXP + 1) {
          sequenceIndexRef.current += 1
          registerTimeout(runGain, 40)
          return
        }

        const actualGain = Math.min(targetXP - startingXP, MAX_XP - startingXP)

        if (actualGain <= 0) {
          sequenceIndexRef.current += 1
          registerTimeout(runGain, 80)
          return
        }

        const nextIndex = stepIndex + 1
        sequenceIndexRef.current = nextIndex

        const zoneBoost = Math.max(1, getCurrentMultiplier(targetXP))
        const targetPercent = (targetXP / MAX_XP) * 100
        const visualPercent = Math.min(99.4, targetPercent)

        // Advance internal ids; orbId not used for rendering, so don't store
        animationRef.current.orbId++
        const floatingId = animationRef.current.floatingId++

        registerTimeout(() => {
          setFloatingXP((prev) => prev.filter((entry) => entry.id !== floatingId))
        }, ORB_IMPACT_DELAY_MS + FLOATING_LIFETIME_MS)

        registerTimeout(
          () => {
            setFloatingXP((prev) => [
              ...prev,
              {
                id: floatingId,
                value: actualGain,
                percent: visualPercent,
                offset: (Math.random() - 0.5) * (18 + zoneBoost * 4),
              },
            ])
          },
          Math.max(0, ORB_IMPACT_DELAY_MS - FLOATING_SPAWN_LEAD_MS)
        )

        registerTimeout(() => {
          // Animate XP value
          const xpAnim = animateValue(
            xpValueRef.current,
            targetXP,
            PROGRESS_DURATION,
            PROGRESS_EASE,
            (value) => {
              xpValueRef.current = value
              setDisplayXP(value)
            }
          )
          registerAnimation(xpAnim)

          // Animate progress value
          const progressAnim = animateValue(
            progressValueRef.current,
            targetPercent,
            PROGRESS_DURATION,
            PROGRESS_EASE,
            (value) => {
              progressValueRef.current = value
              updateProgress(value)

              // Update progress fill transform
              if (progressFillRef.current) {
                const scale = Math.max(value, 0) / 100
                progressFillRef.current.style.transform = `scaleX(${scale})`
              }
            },
            () => {
              xpRef.current = targetXP
            }
          )
          registerAnimation(progressAnim)
        }, ORB_IMPACT_DELAY_MS)

        registerTimeout(runGain, GAIN_INTERVAL_MS)
      }

      registerTimeout(runGain, FIRST_GAIN_DELAY_MS)
    }

    resetAnimation()
    startGainLoop()

    return () => {
      stopped = true
      clearScheduledWork()
    }
  }, [
    animateValue,
    clearScheduledWork,
    getCurrentMultiplier,
    getRandomStar,
    registerAnimation,
    registerTimeout,
    triggerMilestone,
    updateProgress,
  ])

  const progressPercent = progressDisplay
  // Dynamic glow buckets via CSS variables
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
  const intensity = clamp01(progressPercent / 100)
  const zoneBucket =
    progressPercent >= 80
      ? 'zone-4'
      : progressPercent >= 60
        ? 'zone-3'
        : progressPercent >= 40
          ? 'zone-2'
          : progressPercent >= 20
            ? 'zone-1'
            : 'zone-0'
  const levelBucket =
    intensity >= 0.8
      ? 'level-4'
      : intensity >= 0.6
        ? 'level-3'
        : intensity >= 0.4
          ? 'level-2'
          : intensity >= 0.2
            ? 'level-1'
            : 'level-0'

  return (
    <div
      ref={containerRef}
      className={`pf-progress-demo pf-xp-accumulation ${zoneBucket} ${levelBucket}`}
      data-animation-id="progress-bars__xp-accumulation"
    >
      <div className="pf-xp-counter">
        <span className="pf-xp-counter__value">
          {Math.round(displayXP).toLocaleString()} / {MAX_XP.toLocaleString()} XP
        </span>
        {currentMultiplier > 1 && (
          <MultiplierBadge key={currentMultiplier} multiplier={currentMultiplier} />
        )}
      </div>

      <div className="pf-xp-container">
        <div className="pf-progress-track">
          <div
            ref={progressFillRef}
            className="pf-progress-fill"
            style={{
              transform: `scaleX(${Math.max(progressDisplay, 0) / 100})`,
              willChange: 'transform'
            }}
          />

          {multiplierZones.map((zone) => {
            const isActive = progressPercent >= zone.threshold - 0.2
            const milestoneAnim = milestoneAnimations.find((m) => m.threshold === zone.threshold)
            return (
              <div
                key={zone.threshold}
                className={`pf-marker pf-marker--t${zone.threshold} ${isActive ? 'pf-marker--active' : ''}`}
              >
                <MarkerIndicator isActive={isActive} />
                <MarkerDot isActive={isActive} />
                {milestoneAnim && <MilestonePulse threshold={zone.threshold} />}
                {milestoneAnim && <MilestoneHalo threshold={zone.threshold} />}
                <MarkerLabel isActive={isActive}>x{zone.multiplier}</MarkerLabel>
              </div>
            )
          })}

          {([0, 100] as const).map((boundary) => {
            const isStart = boundary === 0
            const isActive = isStart ? true : progressPercent >= 99.8
            const milestoneAnim = milestoneAnimations.find((m) => m.threshold === boundary)
            return (
              <div
                key={`boundary-${boundary}`}
                className={`pf-marker pf-marker--t${boundary} ${isActive ? 'pf-marker--active' : ''}`}
              >
                <MarkerIndicator isActive={isActive} />
                <MarkerDot isActive={isActive} />
                {milestoneAnim && <MilestonePulse threshold={boundary} isBoundary />}
                {milestoneAnim && <MilestoneHalo threshold={boundary} />}
                <MarkerLabel isActive={isActive}>{isStart ? 'Start' : 'End'}</MarkerLabel>
              </div>
            )
          })}
        </div>

        {floatingXP.map((floating) => (
          <FloatingXPDisplay key={floating.id} floating={floating} />
        ))}
      </div>
    </div>
  )
}

