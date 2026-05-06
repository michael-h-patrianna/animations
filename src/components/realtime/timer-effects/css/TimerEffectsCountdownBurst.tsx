/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Dramatic 3-2-1-GO! countdown burst with expanding ring, pulsing glow,
 * and radial particle explosion on each step — CSS variant.
 *
 * Copy-paste files: this file + TimerEffectsCountdownBurst.module.css
 * Runtime deps: react
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import styles from './TimerEffectsCountdownBurst.module.css'

interface TimerEffectsCountdownBurstProps {
  /** Starting countdown number. Default: 3. Clamped to >= 0. */
  count?: number
  /** Text shown on the final "go" step. Default: "GO!" */
  goText?: string
  /** Duration of each numbered step in ms. Default: 800. */
  stepDuration?: number
  /** Hold duration on the GO step before calling onComplete, in ms. Default: 700. */
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
  const startCount = Math.max(0, Math.round(countProp))
  const [current, setCurrent] = useState(startCount)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const onStepRef = useRef(onStep)
  onStepRef.current = onStep

  // Fire onStep when current changes
  useEffect(() => {
    onStepRef.current?.(current)
  }, [current])

  // Reset when count prop changes
  useEffect(() => {
    setCurrent(Math.max(0, Math.round(countProp)))
  }, [countProp])

  // Advance step when the CSS keyframe finishes — no setTimeout drift.
  const handleStepEnd = useCallback(
    (e: React.AnimationEvent) => {
      // Ignore child animations (ring, glow, particles) that bubble up
      if (e.target !== e.currentTarget) return
      if (current > 0) {
        setCurrent((c) => c - 1)
      } else {
        onCompleteRef.current?.()
      }
    },
    [current]
  )

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
          delay: i * 30,
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

  const activeColorVar = isGo
    ? 'var(--countdown-burst-go-color)'
    : 'var(--countdown-burst-countdown-color)'

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    ...colorOverrides,
  }

  const stepClassName = isGo
    ? `${styles['pf-countdown-burst__step']} ${styles['pf-countdown-burst__step--go']}`
    : styles['pf-countdown-burst__step']

  const glowClassName = isGo
    ? `${styles['pf-countdown-burst__glow']} ${styles['pf-countdown-burst__glow--go']}`
    : styles['pf-countdown-burst__glow']

  return (
    <div
      className={styles['pf-countdown-burst']}
      data-animation-id="timer-effects__countdown-burst"
      style={containerStyle}
    >
      {/*
       * Key changes on each step, remounting the entire sub-tree.
       * This replays all CSS animations from the start.
       */}
      <div
        key={current}
        className={stepClassName}
        onAnimationEnd={handleStepEnd}
        style={
          {
            width: size,
            height: size,
            '--step-duration': `${isGo ? goDuration : stepDuration}ms`,
            '--countdown-burst-active-color': activeColorVar,
          } as React.CSSProperties
        }
      >
        {/* Expanding ring */}
        <div className={styles['pf-countdown-burst__ring']} />

        {/* Pulsing glow */}
        <div
          className={glowClassName}
          style={
            {
              width: glowSize,
              height: glowSize,
              left: glowOffset,
              top: glowOffset,
              '--glow-color': `color-mix(in srgb, ${activeColorVar} 60%, transparent)`,
            } as React.CSSProperties
          }
        />

        {/* Main number/text */}
        <div
          className={styles['pf-countdown-burst__number']}
          style={{ fontSize } as React.CSSProperties}
        >
          {displayText}
        </div>

        {/* Particle burst */}
        {particles.map((particle, i) => (
          <div
            key={i}
            className={styles['pf-countdown-burst__particle']}
            style={
              {
                left: particleOffset,
                top: particleOffset,
                width: particleSize,
                height: particleSize,
                '--tx': `${particle.x}px`,
                '--ty': `${particle.y}px`,
                '--delay': `${particle.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

export const TimerEffectsCountdownBurst = memo(TimerEffectsCountdownBurstComponent)
