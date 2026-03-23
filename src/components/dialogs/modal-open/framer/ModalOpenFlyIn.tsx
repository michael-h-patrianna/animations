/**
 * Modal flies in from a trigger element with arced trajectory, impact settle,
 * and optional staggered content reveal. Supports reverse fly-out on close.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 *
 * @example
 * const btnRef = useRef<HTMLButtonElement>(null)
 * <button ref={btnRef} onClick={() => setOpen(true)}>Open</button>
 * {open && (
 *   <ModalOpenFlyIn from={btnRef} duration={600} impactForce={0.8}>
 *     <MyModalContent />
 *   </ModalOpenFlyIn>
 * )}
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { ModalOpenPlaceholder } from '../MockOpenModalContent'
import '../shared.css'
import { computeArcCloseTrajectory, computeArcTrajectory } from '../FlyInTrajectory'
import {
  containerCenter,
  resolvePointRelative,
  DEFAULT_DURATION,
  DEFAULT_IMPACT_FORCE,
  DEFAULT_OVERLAY_OPACITY,
  type ModalOpenProps,
  type ResolvedPoint,
  type TrajectoryArrays,
} from '../SharedTypes'

/** Default: content starts revealing at 60% of fly-in duration. */
const DEFAULT_CONTENT_REVEAL_AT = 60

/** Close animation plays at 70% of open duration for snappy feel. */
const CLOSE_DURATION_RATIO = 0.7

// ── Demo config (catalog only — not part of consumer API) ──────────────

const DEMO_BUTTONS = [
  { label: 'Soft', force: 0.1, duration: 900, reveal: 50 },
  { label: 'Harder', force: 0.6, duration: 520, reveal: 65 },
  { label: "I'm scared", force: 1.0, duration: 400, reveal: 72 },
] as const

interface DemoConfig {
  from: ResolvedPoint
  force: number
  duration: number
  reveal: number
}

function DemoTriggers({
  containerRef,
  onSelect,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  onSelect: (config: DemoConfig) => void
}) {
  const buttonListRef = useRef<(HTMLButtonElement | null)[]>([])

  const handleClick = useCallback(
    (i: number) => {
      const container = containerRef.current
      const btn = buttonListRef.current[i]
      if (!container || !btn) return

      const btnRect = btn.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const cfg = DEMO_BUTTONS[i]!
      onSelect({
        from: {
          x: btnRect.left + btnRect.width / 2 - containerRect.left,
          y: btnRect.top + btnRect.height / 2 - containerRect.top,
        },
        force: cfg.force,
        duration: cfg.duration,
        reveal: cfg.reveal,
      })
    },
    [containerRef, onSelect]
  )

  return (
    <div className="pf-mo-trigger-row">
      {DEMO_BUTTONS.map((btn, i) => (
        <button
          key={btn.label}
          ref={(el) => {
            buttonListRef.current[i] = el
          }}
          type="button"
          className="pf-mo-trigger"
          onClick={() => handleClick(i)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}

// ── Phase state machine ────────────────────────────────────────────────

type Phase = 'idle' | 'opening' | 'open' | 'closing'

// ── Animation component (prop-driven, no demo knowledge) ───────────────

function ModalOpenFlyInComponent({
  from,
  duration = DEFAULT_DURATION,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  children,
  className,
  style,
  contentRevealAt = DEFAULT_CONTENT_REVEAL_AT,
  impactForce = DEFAULT_IMPACT_FORCE,
  onAnimationComplete,
}: ModalOpenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const isDemoMode = from === undefined
  const [demoConfig, setDemoConfig] = useState<DemoConfig | null>(null)
  const [phase, setPhase] = useState<Phase>(isDemoMode ? 'idle' : 'opening')

  // Effective values
  const effectiveDuration = isDemoMode && demoConfig ? demoConfig.duration : duration
  const effectiveForce = isDemoMode && demoConfig ? demoConfig.force : impactForce
  const effectiveReveal = isDemoMode && demoConfig ? demoConfig.reveal : contentRevealAt

  const force = Math.max(0, Math.min(1, effectiveForce))
  const closeDuration = effectiveDuration * CLOSE_DURATION_RATIO

  // Coordinate resolution
  const [fromPoint, setFromPoint] = useState<ResolvedPoint | null>(null)
  const [center, setCenter] = useState<ResolvedPoint | null>(null)
  const [contentRevealed, setContentRevealed] = useState(false)

  // Consumer path
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || isDemoMode) return
    setCenter(containerCenter(container))
    setFromPoint(resolvePointRelative(from, container))
  }, [from, isDemoMode])

  // Demo path
  const handleDemoSelect = useCallback((config: DemoConfig) => {
    const container = containerRef.current
    if (!container) return
    setCenter(containerCenter(container))
    setFromPoint(config.from)
    setDemoConfig(config)
    setPhase('opening')
  }, [])

  // Content reveal timer (opening phase)
  const revealDelayMs = Math.round(
    (effectiveDuration * Math.max(0, Math.min(100, effectiveReveal))) / 100
  )
  useEffect(() => {
    if (phase !== 'opening' || !fromPoint) return
    const timer = setTimeout(() => setContentRevealed(true), revealDelayMs)
    return () => clearTimeout(timer)
  }, [phase, fromPoint, revealDelayMs])

  const handleFlyInComplete = useCallback(() => {
    setPhase('open')
    onAnimationComplete?.()
  }, [onAnimationComplete])

  // Close: unreveal content AND fly out simultaneously (mirrors open behavior)
  const handleClose = useCallback(() => {
    if (phase !== 'open' && phase !== 'opening') return
    setContentRevealed(false) // CSS transitions reverse naturally
    setPhase('closing') // fly-out starts immediately, overlapping with content unreveal
  }, [phase])

  const handleFlyOutComplete = useCallback(() => {
    setPhase('idle')
    setDemoConfig(null)
    setFromPoint(null)
    setContentRevealed(false)
  }, [])

  // Trajectories
  const openTrajectory = useMemo(() => {
    if (!fromPoint || !center) return null
    return computeArcTrajectory(fromPoint, center, force)
  }, [fromPoint, center, force])

  const closeTrajectory = useMemo(() => {
    if (!fromPoint || !center) return null
    return computeArcCloseTrajectory(fromPoint, center, force)
  }, [fromPoint, center, force])

  const reduced = prefersReducedMotion === true
  const isVisible = phase !== 'idle'
  const isClosing = phase === 'closing'
  const activeTrajectory: TrajectoryArrays | null = isClosing ? closeTrajectory : openTrajectory
  const activeDurationS = (isClosing ? closeDuration : effectiveDuration) / 1000

  return (
    <div ref={containerRef} className="pf-mo-container" data-animation-id="modal-open__fly-in">
      {isDemoMode && phase === 'idle' && (
        <DemoTriggers containerRef={containerRef} onSelect={handleDemoSelect} />
      )}

      {isVisible && activeTrajectory !== null && (
        <>
          <m.div
            className="pf-mo-overlay"
            initial={{ opacity: isClosing ? overlayOpacity : 0 }}
            animate={{ opacity: isClosing ? 0 : overlayOpacity }}
            transition={{
              duration: reduced ? 0.01 : activeDurationS * 0.5,
              ease: [0, 0, 0.2, 1],
            }}
            style={{ animation: 'none' }}
          />

          <div className="pf-mo-stage">
            <m.div
              key={isClosing ? 'close' : 'open'}
              className={`pf-mo-modal${className ? ` ${className}` : ''}`}
              style={{ ...style, animation: 'none' }}
              initial={
                reduced
                  ? { scale: isClosing ? 1 : 0.85, opacity: isClosing ? 1 : 0 }
                  : {
                      x: activeTrajectory.x[0],
                      y: activeTrajectory.y[0],
                      scale: activeTrajectory.scale[0],
                      opacity: activeTrajectory.opacity[0],
                    }
              }
              animate={
                reduced
                  ? { scale: isClosing ? 0.85 : 1, opacity: isClosing ? 0 : 1 }
                  : {
                      x: activeTrajectory.x,
                      y: activeTrajectory.y,
                      scale: activeTrajectory.scale,
                      opacity: activeTrajectory.opacity,
                    }
              }
              transition={
                reduced
                  ? { duration: 0.01 }
                  : {
                      duration: activeDurationS,
                      times: activeTrajectory.times,
                      ease: 'linear',
                    }
              }
              onAnimationComplete={isClosing ? handleFlyOutComplete : handleFlyInComplete}
            >
              {!isClosing && (
                <m.div
                  className="pf-mo-impact-glow"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: reduced ? 0 : [0, 0, force * 1.0, force * 0.4, force * 0.1, 0],
                  }}
                  transition={{
                    duration: activeDurationS,
                    times: [0, 0.68, 0.78, 0.88, 0.95, 1],
                  }}
                  style={{ animation: 'none' }}
                />
              )}
              <ModalOpenPlaceholder
                revealed={contentRevealed}
                onClose={isDemoMode ? handleClose : undefined}
              >
                {children}
              </ModalOpenPlaceholder>
            </m.div>
          </div>
        </>
      )}
    </div>
  )
}

export const ModalOpenFlyIn = memo(ModalOpenFlyInComponent)
