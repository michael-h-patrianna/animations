import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './ProgressBarsXpAccumulation.css'
import {
  MultiplierBadge,
  MarkerIndicator,
  MarkerDot,
  MarkerLabel,
  MilestonePulse,
  MilestoneHalo,
  FloatingXPDisplay,
} from './XpAccumulationHelpers'

import {
  createXpSequence,
  FIRST_GAIN_DELAY_MS,
  FLOATING_LIFETIME_MS,
  FLOATING_SPAWN_LEAD_MS,
  GAIN_INTERVAL_MS,
  getCurrentMultiplier as getMultFromConfig,
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
import type { ProgressBarProps } from '../SharedTypes'

interface XpAccumulationProps extends ProgressBarProps {
  /** Maximum XP value. Default: 1000. */
  maxXP?: number
}

export function ProgressBarsXpAccumulation({
  progress,
  maxXP: maxXPProp,
  className,
  style,
}: XpAccumulationProps) {
  const maxXP = maxXPProp ?? MAX_XP
  const isControlled = progress !== undefined
  const containerRef = useRef<HTMLDivElement>(null)
  const [floatingXP, setFloatingXP] = useState<FloatingXP[]>([])
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [milestoneAnimations, setMilestoneAnimations] = useState<MilestoneAnimation[]>([])
  const [progressDisplay, setProgressDisplay] = useState((INITIAL_XP / MAX_XP) * 100)
  const [displayXP, setDisplayXP] = useState(INITIAL_XP)
  const progressValueRef = useRef((INITIAL_XP / MAX_XP) * 100)
  const xpValueRef = useRef(INITIAL_XP)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const xpRef = useRef(INITIAL_XP)
  const animationRef = useRef({ orbId: 0, floatingId: 0, milestoneId: 0 })
  const timeoutHandlesRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const animationFrameHandlesRef = useRef<Set<number>>(new Set())
  const animationControlsRef = useRef<Animation[]>([])
  const reachedMilestonesRef = useRef<Set<number>>(new Set())
  const lastProgressRef = useRef((INITIAL_XP / MAX_XP) * 100)
  const xpSequenceRef = useRef<number[]>(createXpSequence())
  const sequenceIndexRef = useRef(0)
  const multiplierZones = useMemo(() => [...MULTIPLIER_ZONES], [])
  const registerTimeout = useCallback((cb: () => void, delay: number) => {
    const h = setTimeout(() => { timeoutHandlesRef.current = timeoutHandlesRef.current.filter((e) => e !== h); cb() }, delay)
    timeoutHandlesRef.current.push(h)
    return h
  }, [])
  const registerAnimation = useCallback((control: Animation) => {
    animationControlsRef.current.push(control)
    return control
  }, [])
  const registerAnimationFrame = useCallback((callback: FrameRequestCallback) => {
    let handle = 0
    handle = requestAnimationFrame((timestamp) => {
      animationFrameHandlesRef.current.delete(handle)
      callback(timestamp)
    })
    animationFrameHandlesRef.current.add(handle)
    return handle
  }, [])
  const clearScheduledWork = useCallback(() => {
    timeoutHandlesRef.current.forEach(clearTimeout)
    timeoutHandlesRef.current = []
    animationFrameHandlesRef.current.forEach((handle) => cancelAnimationFrame(handle))
    animationFrameHandlesRef.current.clear()
    animationControlsRef.current.forEach((control) => control.cancel())
    animationControlsRef.current = []
  }, [])
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
    (threshold: number) => {
      const milestoneId = animationRef.current.milestoneId++
      setMilestoneAnimations((prev) => [...prev, { id: milestoneId, threshold }])
      registerTimeout(() => {
        setMilestoneAnimations((prev) => prev.filter((m) => m.id !== milestoneId))
      }, 2000)
    },
    [registerTimeout]
  )
  const cubicBezier = useCallback((p1x: number, p1y: number, p2x: number, p2y: number) => {
    return `cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y})`
  }, [])
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
      const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: duration * 1000,
        easing: cubicBezier(ease[0], ease[1], ease[2], ease[3]),
      })
      const startTime = performance.now()
      const range = to - from
      const updateLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        onUpdate(from + range * progress)
        if (progress < 1) {
          registerAnimationFrame(updateLoop)
        } else {
          onComplete?.()
        }
      }
      registerAnimationFrame(updateLoop)
      return animation
    },
    [cubicBezier, registerAnimationFrame]
  ) // Update progress display when progress changes
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
            triggerMilestone(zone.threshold)
          }
        }) // Trigger completion milestone at 100%
        if (!reachedMilestonesRef.current.has(100) && previous < 100 && latest >= 100) {
          reachedMilestonesRef.current.add(100)
          triggerMilestone(100)
        }
      }
      lastProgressRef.current = latest
    },
    [multiplierZones, triggerMilestone]
  )
  // Controlled mode: set display values directly
  useEffect(() => {
    if (!isControlled) return
    const p = (progress ?? 0) * 100
    setProgressDisplay(p)
    setDisplayXP(Math.round((progress ?? 0) * maxXP))
    setCurrentMultiplier(getMultFromConfig(Math.round((progress ?? 0) * maxXP)))
    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${(progress ?? 0)})`
    }
  }, [isControlled, progress, maxXP])

  useEffect(() => {
    if (isControlled) return
    const computedMultiplier = getCurrentMultiplier(displayXP)
    setCurrentMultiplier((prev) => (prev === computedMultiplier ? prev : computedMultiplier))
  }, [displayXP, getCurrentMultiplier, isControlled])
  useEffect(() => {
    if (isControlled) return
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
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${((INITIAL_XP / MAX_XP) * 100) / 100})`
      }
      setFloatingXP([])
      setMilestoneAnimations([])
      setDisplayXP(INITIAL_XP)
      setProgressDisplay((INITIAL_XP / MAX_XP) * 100)
      setCurrentMultiplier(getCurrentMultiplier(INITIAL_XP))
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
        const visualPercent = Math.min(99.4, targetPercent)
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
          const progressAnim = animateValue(
            progressValueRef.current,
            targetPercent,
            PROGRESS_DURATION,
            PROGRESS_EASE,
            (value) => {
              progressValueRef.current = value
              updateProgress(value) // Update progress fill transform
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
    registerAnimation,
    registerTimeout,
    triggerMilestone,
    updateProgress,
    isControlled,
  ])
  const progressPercent = progressDisplay
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
      className={`pf-xp-accumulation ${zoneBucket} ${levelBucket}${className ? ` ${className}` : ''}`}
      style={style}
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
              willChange: 'transform',
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
