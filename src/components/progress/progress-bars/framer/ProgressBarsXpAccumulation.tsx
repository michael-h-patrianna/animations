import {
  AnimatePresence,
  animate,
  easeOut,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from 'motion/react'
import * as m from 'motion/react-m'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  createXpSequence,
  FIRST_GAIN_DELAY_MS,
  FLOATING_LIFETIME_MS,
  FLOATING_SPAWN_LEAD_MS,
  GAIN_INTERVAL_MS,
  getCurrentMultiplier,
  getProgressBuckets,
  INITIAL_XP,
  MAX_XP,
  MULTIPLIER_ZONES,
  ORB_IMPACT_DELAY_MS,
  PROGRESS_DURATION,
  PROGRESS_EASE,
  RESET_DELAY_MS,
  type FloatingXP,
  type MilestoneAnimation,
} from '../XpAccumulationConfig'
export function ProgressBarsXpAccumulation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [floatingXP, setFloatingXP] = useState<FloatingXP[]>([])
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [milestoneAnimations, setMilestoneAnimations] = useState<MilestoneAnimation[]>([])
  const [progressDisplay, setProgressDisplay] = useState((INITIAL_XP / MAX_XP) * 100)
  const [displayXP, setDisplayXP] = useState(INITIAL_XP)
  const progressValue = useMotionValue((INITIAL_XP / MAX_XP) * 100)
  const progressScale = useTransform(progressValue, (value) => Math.max(value, 0) / 100)
  const xpValue = useMotionValue(INITIAL_XP)
  const xpRef = useRef(INITIAL_XP)
  const animationRef = useRef<{ orbId: number; floatingId: number; milestoneId: number }>({
    orbId: 0,
    floatingId: 0,
    milestoneId: 0,
  })
  const timeoutHandlesRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const animationControlsRef = useRef<AnimationPlaybackControls[]>([])
  const reachedMilestonesRef = useRef<Set<number>>(new Set())
  const lastProgressRef = useRef(progressValue.get())
  const xpSequenceRef = useRef<number[]>(createXpSequence())
  const sequenceIndexRef = useRef(0)
  const multiplierZones = useMemo(() => [...MULTIPLIER_ZONES], [])
  const registerTimeout = useCallback((callback: () => void, delay: number) => {
    const handle = setTimeout(() => {
      timeoutHandlesRef.current = timeoutHandlesRef.current.filter((entry) => entry !== handle)
      callback()
    }, delay)
    timeoutHandlesRef.current.push(handle)
    return handle
  }, [])
  const registerAnimation = useCallback((control: AnimationPlaybackControls) => {
    animationControlsRef.current.push(control)
    return control
  }, [])
  const clearScheduledWork = useCallback(() => {
    timeoutHandlesRef.current.forEach(clearTimeout)
    timeoutHandlesRef.current = []
    animationControlsRef.current.forEach((control) => control.stop())
    animationControlsRef.current = []
  }, [])
  const triggerMilestone = useCallback(
    (threshold: number) => {
      const milestoneId = animationRef.current.milestoneId++
      setMilestoneAnimations((prev) => [...prev, { id: milestoneId, threshold }])
      registerTimeout(() => {
        setMilestoneAnimations((prev) => prev.filter((m) => m.id !== milestoneId))
      }, 2000)
    },
    [registerTimeout]
  ) // Note: Avoid layout reads (getBoundingClientRect/clientWidth) for marker positioning;
  // we rely on pure CSS percentage-based placement relative to the track.
  useEffect(() => {
    const unsubscribe = xpValue.on('change', (latest) => {
      setDisplayXP(latest)
    })
    return () => {
      unsubscribe()
    }
  }, [xpValue])
  useEffect(() => {
    lastProgressRef.current = progressValue.get()
    const unsubscribe = progressValue.on('change', (latest) => {
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
            triggerMilestone(zone.threshold)
          }
        }) // Trigger completion milestone at 100%
        if (!reachedMilestonesRef.current.has(100) && previous < 100 && latest >= 100) {
          reachedMilestonesRef.current.add(100)
          triggerMilestone(100)
        }
      }
      lastProgressRef.current = latest
    })
    return () => {
      unsubscribe()
    }
  }, [multiplierZones, progressValue, triggerMilestone])
  useEffect(() => {
    const computedMultiplier = getCurrentMultiplier(displayXP)
    setCurrentMultiplier((prev) => (prev === computedMultiplier ? prev : computedMultiplier))
  }, [displayXP])
  useEffect(() => {
    let stopped = false
    const resetAnimation = () => {
      clearScheduledWork()
      reachedMilestonesRef.current.clear()
      animationRef.current = { orbId: 0, floatingId: 0, milestoneId: 0 }
      xpSequenceRef.current = createXpSequence()
      sequenceIndexRef.current = 0
      xpRef.current = INITIAL_XP
      progressValue.stop()
      xpValue.stop()
      progressValue.set((INITIAL_XP / MAX_XP) * 100)
      xpValue.set(INITIAL_XP)
      lastProgressRef.current = progressValue.get()
      setFloatingXP([])
      setMilestoneAnimations([])
      setDisplayXP(INITIAL_XP)
      setProgressDisplay((INITIAL_XP / MAX_XP) * 100)
      setCurrentMultiplier(getCurrentMultiplier(INITIAL_XP)) // Emit a subtle activation pulse for the Start marker
      registerTimeout(() => {
        triggerMilestone(0)
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
        const targetXP = script[stepIndex]!
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
        const visualPercent = Math.min(99.4, targetPercent) // Advance internal ids; orbId not used for rendering, so don't store
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
          registerAnimation(
            animate(xpValue, targetXP, { duration: PROGRESS_DURATION, ease: PROGRESS_EASE })
          )
          registerAnimation(
            animate(progressValue, targetPercent, {
              duration: PROGRESS_DURATION,
              ease: PROGRESS_EASE,
              onComplete: () => {
                xpRef.current = targetXP
              },
            })
          )
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
    clearScheduledWork,
    progressValue,
    registerAnimation,
    registerTimeout,
    triggerMilestone,
    xpValue,
  ])
  const progressPercent = progressDisplay
  const { zoneBucket, levelBucket } = getProgressBuckets(progressPercent)
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
        <AnimatePresence>
          {currentMultiplier > 1 && (
            <m.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.38, ease: easeOut }}
              className="pf-xp-multiplier"
            >
              x{currentMultiplier}
            </m.span>
          )}
        </AnimatePresence>
      </div>

      <div className="pf-xp-container">
        <div className="pf-progress-track">
          <m.div className="pf-progress-fill" style={{ scaleX: progressScale }} />

          {multiplierZones.map((zone) => {
            const isActive = progressPercent >= zone.threshold - 0.2
            const milestoneAnim = milestoneAnimations.find((m) => m.threshold === zone.threshold)
            return (
              <div
                key={zone.threshold}
                className={`pf-marker pf-marker--t${zone.threshold} ${isActive ? 'pf-marker--active' : ''}`}
              >
                <m.div
                  className="pf-marker__indicator"
                  animate={{ opacity: isActive ? 1 : 0.38, scaleY: isActive ? 1 : 0.7 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                />
                <m.div
                  className="pf-marker__dot"
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  transition={{ duration: 0.32, ease: easeOut }}
                />
                <AnimatePresence>
                  {milestoneAnim && (
                    <m.div
                      key={`pulse-${zone.threshold}`}
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: easeOut }}
                      className="pf-marker__pulse"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {milestoneAnim && (
                    <m.div
                      key={`halo-${zone.threshold}`}
                      initial={{ scale: 0.55, opacity: 0.6 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: easeOut }}
                      className="pf-marker__halo"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>{/* Trophy animation removed */}</AnimatePresence>
                <m.span
                  className="pf-marker__label"
                  animate={{ opacity: isActive ? 1 : 0.42 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                >
                  x{zone.multiplier}
                </m.span>
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
                <m.div
                  className="pf-marker__indicator"
                  animate={{ opacity: isActive ? 1 : 0.38, scaleY: isActive ? 1 : 0.7 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                />
                <m.div
                  className="pf-marker__dot"
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  transition={{ duration: 0.32, ease: easeOut }}
                />
                <AnimatePresence>
                  {milestoneAnim && (
                    <m.div
                      key={`pulse-boundary-${boundary}`}
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: easeOut }}
                      className="pf-marker__pulse pf-marker__pulse--boundary"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {milestoneAnim && (
                    <m.div
                      key={`halo-boundary-${boundary}`}
                      initial={{ scale: 0.55, opacity: 0.6 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: easeOut }}
                      className="pf-marker__halo"
                    />
                  )}
                </AnimatePresence>
                <m.span
                  className="pf-marker__label"
                  animate={{ opacity: isActive ? 1 : 0.42 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                >
                  {isStart ? 'Start' : 'End'}
                </m.span>
              </div>
            )
          })}
        </div>

        <AnimatePresence>
          {floatingXP.map((floating) => (
            <m.div
              key={floating.id}
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, -18, -36, -52],
                scale: [0.6, 1.05, 1, 0.92],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.45, times: [0, 0.28, 0.68, 1], ease: easeOut }}
              className="pf-floating-xp"
              style={{ left: `${Math.min(floating.percent, 100)}%`, marginLeft: floating.offset }}
            >
              +{Math.round(floating.value)} XP
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
