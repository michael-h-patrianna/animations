/**
 * Modal flies in from a trigger element with arced trajectory — CSS variant.
 * Uses Web Animations API for trajectory, CSS @keyframes for scale/opacity/glow.
 * Supports reverse fly-out on close.
 *
 * Copy-paste files: this file + ModalOpenFlyIn.css + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { ModalOpenPlaceholder } from '../MockOpenModalContent'
import '../shared.css'
import './ModalOpenFlyIn.css'
import {
  computeArcTrajectory,
  containerCenter,
  resolvePointRelative,
  reverseTrajectory,
  DEFAULT_DURATION,
  DEFAULT_IMPACT_FORCE,
  DEFAULT_OVERLAY_OPACITY,
  MIN_ARC_DISTANCE,
  type ModalOpenProps,
  type ResolvedPoint,
} from '../SharedTypes'

/** Default: content starts revealing at 60% of fly-in duration. */
const DEFAULT_CONTENT_REVEAL_AT = 60

const CLOSE_DURATION_RATIO = 0.7

// ── Demo config ────────────────────────────────────────────────────────

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

// ── Animation component ────────────────────────────────────────────────

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
  const modalRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<Animation | null>(null)

  const isDemoMode = from === undefined
  const [demoConfig, setDemoConfig] = useState<DemoConfig | null>(null)
  const [phase, setPhase] = useState<Phase>(isDemoMode ? 'idle' : 'opening')

  const effectiveDuration = isDemoMode && demoConfig ? demoConfig.duration : duration
  const effectiveForce = isDemoMode && demoConfig ? demoConfig.force : impactForce
  const effectiveReveal = isDemoMode && demoConfig ? demoConfig.reveal : contentRevealAt
  const force = Math.max(0, Math.min(1, effectiveForce))
  const closeDuration = effectiveDuration * CLOSE_DURATION_RATIO

  const [fromPoint, setFromPoint] = useState<ResolvedPoint | null>(null)
  const [center, setCenter] = useState<ResolvedPoint | null>(null)
  const [contentRevealed, setContentRevealed] = useState(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || isDemoMode) return
    setCenter(containerCenter(container))
    setFromPoint(resolvePointRelative(from, container))
  }, [from, isDemoMode])

  const handleDemoSelect = useCallback((config: DemoConfig) => {
    const container = containerRef.current
    if (!container) return
    setCenter(containerCenter(container))
    setFromPoint(config.from)
    setDemoConfig(config)
    setPhase('opening')
  }, [])

  // Content reveal timer
  const revealDelayMs = Math.round(
    (effectiveDuration * Math.max(0, Math.min(100, effectiveReveal))) / 100
  )
  useEffect(() => {
    if (phase !== 'opening' || !fromPoint) return
    const timer = setTimeout(() => setContentRevealed(true), revealDelayMs)
    return () => clearTimeout(timer)
  }, [phase, fromPoint, revealDelayMs])

  // Close: unreveal content AND fly out simultaneously (mirrors open behavior)
  const handleClose = useCallback(() => {
    if (phase !== 'open' && phase !== 'opening') return
    setContentRevealed(false)
    setPhase('closing')
  }, [phase])

  const handleFlyOutComplete = useCallback(() => {
    setPhase('idle')
    setDemoConfig(null)
    setFromPoint(null)
    setContentRevealed(false)
  }, [])

  const distance =
    fromPoint && center
      ? Math.sqrt((fromPoint.x - center.x) ** 2 + (fromPoint.y - center.y) ** 2)
      : 0
  const isArc = distance >= MIN_ARC_DISTANCE

  const openTrajectory = useMemo(() => {
    if (!fromPoint || !center) return null
    return computeArcTrajectory(fromPoint, center, force)
  }, [fromPoint, center, force])

  const closeTrajectory = useMemo(() => {
    if (!openTrajectory) return null
    return reverseTrajectory(openTrajectory)
  }, [openTrajectory])

  const isVisible = phase !== 'idle'
  const isClosing = phase === 'closing'
  const activeTrajectory = isClosing ? closeTrajectory : openTrajectory
  const activeDuration = isClosing ? closeDuration : effectiveDuration

  // Web Animations API for trajectory
  useEffect(() => {
    const el = modalRef.current
    if (!el || !activeTrajectory || !isVisible || !isArc) return

    animRef.current?.cancel()

    const keyframes: Keyframe[] = activeTrajectory.times.map((t, i) => ({
      offset: t,
      transform: `translate(${activeTrajectory.x[i]}px, ${activeTrajectory.y[i]}px)`,
    }))

    const anim = el.animate(keyframes, {
      duration: activeDuration,
      fill: 'forwards',
      easing: 'linear',
    })
    animRef.current = anim

    anim.onfinish = () => {
      if (isClosing) handleFlyOutComplete()
      else {
        setPhase('open')
        onAnimationComplete?.()
      }
    }

    return () => anim.cancel()
  }, [
    activeTrajectory,
    activeDuration,
    isVisible,
    isArc,
    isClosing,
    handleFlyOutComplete,
    onAnimationComplete,
  ])

  return (
    <div ref={containerRef} className="pf-mo-container" data-animation-id="modal-open__fly-in">
      {isDemoMode && phase === 'idle' && (
        <DemoTriggers containerRef={containerRef} onSelect={handleDemoSelect} />
      )}

      {isVisible && activeTrajectory !== null && (
        <>
          <div
            className={`pf-mo-overlay ${isClosing ? 'pf-mo-overlay--closing' : 'pf-mo-overlay--css'}`}
            style={
              {
                '--pf-mo-overlay-opacity': overlayOpacity,
                '--pf-mo-duration': `${activeDuration}ms`,
              } as React.CSSProperties
            }
          />

          <div className="pf-mo-stage">
            <div
              ref={modalRef}
              className={`pf-mo-modal ${isArc ? (isClosing ? 'pf-mo-modal--arc-close' : 'pf-mo-modal--arc') : 'pf-mo-modal--pop'}${className ? ` ${className}` : ''}`}
              style={{ ...style, '--pf-mo-duration': `${activeDuration}ms` } as React.CSSProperties}
            >
              {!isClosing && (
                <div
                  className="pf-mo-impact-glow pf-mo-impact-glow--css"
                  style={{ '--pf-mo-duration': `${activeDuration}ms` } as React.CSSProperties}
                />
              )}
              <ModalOpenPlaceholder
                revealed={contentRevealed}
                onClose={isDemoMode ? handleClose : undefined}
              >
                {children}
              </ModalOpenPlaceholder>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export const ModalOpenFlyIn = memo(ModalOpenFlyInComponent)
