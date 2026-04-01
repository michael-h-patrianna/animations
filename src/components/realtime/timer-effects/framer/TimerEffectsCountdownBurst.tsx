/**
 * Dramatic 3-2-1-GO! countdown burst with expanding ring, pulsing glow,
 * and radial particle explosion on each step.
 *
 * Copy-paste files: this file + TimerEffectsCountdownBurst.module.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import styles from './TimerEffectsCountdownBurst.module.css'

interface TimerEffectsCountdownBurstProps {
  /** Starting countdown number. Default: 3. Clamped to >= 0. */
  count?: number
  /** Text shown on the final "go" step. Default: "GO!" */
  goText?: string
  /** Total duration of each numbered step (entrance + hold + exit) in ms. Default: 800. */
  stepDuration?: number
  /** Total duration of the GO step (entrance + hold) before calling onComplete, in ms. Default: 700. */
  goDuration?: number
  /** Color of the text, ring, glow, and particles during numbered steps. Default: "#ecc3ff". */
  countdownColor?: string
  /** Color of the text, ring, glow, and particles on the GO step. Default: "#4db88a". */
  goColor?: string
  /** Number of radial burst particles per step. Default: 8. */
  particleCount?: number
  /** Diameter of the ring/glow container in px. Default: 200. */
  size?: number
  /** Font size of the countdown number. Default: "5rem". */
  fontSize?: string
  /** Called once after the GO step completes. */
  onComplete?: () => void
  /** Called at the start of each step with the current display number (0 = GO step). */
  onStep?: (step: number) => void
}

/** Exit animation duration in seconds. */
const EXIT_S = 0.15

function TimerEffectsCountdownBurstComponent({
  count: countProp = 3,
  goText = 'GO!',
  stepDuration = 800,
  goDuration = 700,
  countdownColor,
  goColor,
  particleCount = 8,
  size = 200,
  fontSize = '5rem',
  onComplete,
  onStep,
}: TimerEffectsCountdownBurstProps) {
  const prefersReducedMotion = useReducedMotion()
  const startCount = Math.max(0, Math.round(countProp))
  const [current, setCurrent] = useState(startCount)
  // True once the step's entrance animation finishes — starts the hold timer.
  const [holdReady, setHoldReady] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const onStepRef = useRef(onStep)
  onStepRef.current = onStep

  // Reduced motion: simple crossfade, no ring/particles/glow
  const enterTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }

  const exitTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: EXIT_S, ease: 'easeOut' as const }

  // Fire onStep when current changes
  useEffect(() => {
    onStepRef.current?.(current)
  }, [current])

  // Hold timer — starts after entrance animation completes.
  // Subtract entrance/exit durations so total step time ≈ stepDuration,
  // matching the CSS variant where stepDuration is the full keyframe duration.
  const enterMs = enterTransition.duration * 1000
  const exitMs = EXIT_S * 1000
  useEffect(() => {
    if (!holdReady) return
    if (current > 0) {
      const holdMs = Math.max(0, stepDuration - enterMs - exitMs)
      const timer = setTimeout(() => {
        setHoldReady(false)
        setCurrent((c) => c - 1)
      }, holdMs)
      return () => clearTimeout(timer)
    }
    // GO step — no exit, so only subtract entrance
    const holdMs = Math.max(0, goDuration - enterMs)
    const timer = setTimeout(() => {
      onCompleteRef.current?.()
    }, holdMs)
    return () => clearTimeout(timer)
  }, [holdReady, current, stepDuration, goDuration, enterMs, exitMs])

  // Reset when count prop changes
  useEffect(() => {
    setCurrent(Math.max(0, Math.round(countProp)))
    setHoldReady(false)
  }, [countProp])

  const handleEntranceComplete = useCallback(() => {
    setHoldReady(true)
  }, [])

  const isGo = current === 0
  const displayText = isGo ? goText : String(current)

  const glowSize = size * 1.25
  const glowOffset = (size - glowSize) / 2
  const particleSize = Math.max(6, Math.round(size * 0.06))
  const particleDistance = size * 0.4
  const particleOffset = (size - particleSize) / 2

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => {
        const angle = (360 / particleCount) * i
        const radian = (angle * Math.PI) / 180
        return {
          x: Math.cos(radian) * particleDistance,
          y: Math.sin(radian) * particleDistance,
        }
      }),
    [particleCount, particleDistance]
  )

  // Build CSS custom property overrides — only set when props are provided.
  // Defaults live in the module CSS via --countdown-burst-countdown-color / --countdown-burst-go-color.
  const colorOverrides: Record<string, string> = {}
  if (countdownColor !== undefined)
    colorOverrides['--countdown-burst-countdown-color'] = countdownColor
  if (goColor !== undefined) colorOverrides['--countdown-burst-go-color'] = goColor

  // Active color resolves per-step: go vs countdown. When a color prop is provided,
  // the custom property was overridden above; when not, the CSS default applies.
  const activeColorVar = isGo
    ? 'var(--countdown-burst-go-color)'
    : 'var(--countdown-burst-countdown-color)'

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    ...colorOverrides,
    '--countdown-burst-active-color': activeColorVar,
  } as React.CSSProperties

  const glowStyle: React.CSSProperties = {
    width: glowSize,
    height: glowSize,
    left: glowOffset,
    top: glowOffset,
    '--countdown-burst-glow-color': `color-mix(in srgb, ${activeColorVar} 60%, transparent)`,
  } as React.CSSProperties

  const numberStyle: React.CSSProperties = {
    fontSize,
  }

  const particleBaseStyle: React.CSSProperties = {
    left: particleOffset,
    top: particleOffset,
    width: particleSize,
    height: particleSize,
  }

  return (
    <div
      className={styles['pf-countdown-burst-fm']}
      data-animation-id="timer-effects__countdown-burst"
      style={containerStyle}
    >
      <AnimatePresence mode="wait">
        <m.div
          key={current}
          className={styles['pf-countdown-burst-fm__step']}
          style={containerStyle}
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, rotate: -30, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1, transition: enterTransition }
              : {
                  scale: [0, 1.3, 1],
                  rotate: [-30, 10, 0],
                  opacity: [0, 1, 1],
                  transition: enterTransition,
                }
          }
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: exitTransition }
              : {
                  scale: 1.5,
                  opacity: 0,
                  transition: exitTransition,
                }
          }
          onAnimationComplete={handleEntranceComplete}
        >
          {/* Expanding ring */}
          {!prefersReducedMotion && (
            <m.div
              className={styles['pf-countdown-burst-fm__ring']}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 0.8, 0],
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

          {/* Pulsing glow */}
          {!prefersReducedMotion && (
            <m.div
              className={styles['pf-countdown-burst-fm__glow']}
              style={glowStyle}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.3, 0.6],
              }}
              transition={{
                duration: 0.8,
                repeat: current > 0 ? 1 : 0,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Main number/text */}
          <m.div
            className={styles['pf-countdown-burst-fm__number']}
            style={numberStyle}
            initial={prefersReducedMotion ? undefined : { y: 30 }}
            animate={prefersReducedMotion ? undefined : { y: 0 }}
            transition={
              prefersReducedMotion ? undefined : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {displayText}
          </m.div>

          {/* Particle burst */}
          {!prefersReducedMotion &&
            particles.map((particle, i) => (
              <m.div
                key={i}
                className={styles['pf-countdown-burst-fm__particle']}
                style={particleBaseStyle}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0.4],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
        </m.div>
      </AnimatePresence>
    </div>
  )
}

export const TimerEffectsCountdownBurst = memo(TimerEffectsCountdownBurstComponent)
