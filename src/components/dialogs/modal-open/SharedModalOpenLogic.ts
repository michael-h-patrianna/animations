/**
 * Shared phase machine and demo logic for all modal-open animations.
 * Each animation component calls useModalOpenLogic, then uses the returned
 * state to drive its specific visual animation.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react'
import {
  containerCenter,
  resolvePointRelative,
  DEFAULT_DURATION,
  DEFAULT_IMPACT_FORCE,
  DEFAULT_OVERLAY_OPACITY,
  type ModalOpenProps,
  type ResolvedPoint,
} from './SharedTypes'

const DEFAULT_CONTENT_REVEAL_AT = 60
const CLOSE_DURATION_RATIO = 0.7

/** Phase state machine for all modal-open animations. */
export type Phase = 'idle' | 'opening' | 'open' | 'closing'

/** Config passed from demo trigger buttons. */
export interface DemoConfig {
  from: ResolvedPoint
  force: number
  duration: number
  reveal: number
}

/** Demo button presets. Animation components define their own. */
export interface DemoPreset {
  label: string
  force: number
  duration: number
  reveal: number
}

/** Resolved effective values derived from props + demo config. */
function resolveEffectiveValues(
  props: ModalOpenProps,
  demoConfig: DemoConfig | null,
  isDemoMode: boolean
) {
  const {
    duration = DEFAULT_DURATION,
    overlayOpacity = DEFAULT_OVERLAY_OPACITY,
    contentRevealAt = DEFAULT_CONTENT_REVEAL_AT,
    impactForce = DEFAULT_IMPACT_FORCE,
  } = props

  const effectiveDuration = isDemoMode && demoConfig ? demoConfig.duration : duration
  const effectiveForce = isDemoMode && demoConfig ? demoConfig.force : impactForce
  const effectiveReveal = isDemoMode && demoConfig ? demoConfig.reveal : contentRevealAt

  const force = Math.max(0, Math.min(1, effectiveForce))
  const durationS = effectiveDuration / 1000
  const closeDurationS = durationS * CLOSE_DURATION_RATIO
  const closeDurationMs = effectiveDuration * CLOSE_DURATION_RATIO

  return {
    effectiveDuration,
    force,
    durationS,
    closeDurationS,
    closeDurationMs,
    overlayOpacity: overlayOpacity ?? DEFAULT_OVERLAY_OPACITY,
    effectiveReveal,
  }
}

/** Phase transitions and content reveal timer. */
function usePhaseLogic(
  phase: Phase,
  setPhase: (p: Phase) => void,
  fromPoint: ResolvedPoint | null,
  effectiveDuration: number,
  effectiveReveal: number,
  onAnimationComplete: ModalOpenProps['onAnimationComplete'],
  setContentRevealed: (v: boolean) => void,
  setDemoConfig: (v: DemoConfig | null) => void,
  setFromPoint: (v: ResolvedPoint | null) => void
) {
  const revealDelayMs = Math.round(
    (effectiveDuration * Math.max(0, Math.min(100, effectiveReveal))) / 100
  )

  useEffect(() => {
    if (phase !== 'opening' || !fromPoint) return
    const timer = setTimeout(() => setContentRevealed(true), revealDelayMs)
    return () => clearTimeout(timer)
  }, [phase, fromPoint, revealDelayMs, setContentRevealed])

  const handleOpenComplete = useCallback(() => {
    setPhase('open')
    onAnimationComplete?.()
  }, [onAnimationComplete, setPhase])

  const handleClose = useCallback(() => {
    if (phase !== 'open' && phase !== 'opening') return
    setContentRevealed(false)
    setPhase('closing')
  }, [phase, setPhase, setContentRevealed])

  const handleCloseComplete = useCallback(() => {
    setPhase('idle')
    setDemoConfig(null)
    setFromPoint(null)
    setContentRevealed(false)
  }, [setPhase, setDemoConfig, setFromPoint, setContentRevealed])

  return { handleOpenComplete, handleClose, handleCloseComplete }
}

/** Resolves click position relative to container and triggers the opening phase. */
function useDemoClickHandler(
  containerRef: RefObject<HTMLDivElement | null>,
  buttonListRef: RefObject<(HTMLButtonElement | null)[]>,
  presets: readonly DemoPreset[],
  setCenter: (v: ResolvedPoint) => void,
  setFromPoint: (v: ResolvedPoint) => void,
  setDemoConfig: (v: DemoConfig) => void,
  setPhase: (p: Phase) => void
) {
  return useCallback(
    (i: number) => {
      const container = containerRef.current
      const btn = buttonListRef.current[i]
      if (!container || !btn) return
      const btnRect = btn.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const point = {
        x: btnRect.left + btnRect.width / 2 - containerRect.left,
        y: btnRect.top + btnRect.height / 2 - containerRect.top,
      }
      const cfg = presets[i]!
      setCenter(containerCenter(container))
      setFromPoint(point)
      setDemoConfig({ from: point, force: cfg.force, duration: cfg.duration, reveal: cfg.reveal })
      setPhase('opening')
    },
    [containerRef, buttonListRef, presets, setCenter, setFromPoint, setDemoConfig, setPhase]
  )
}

/**
 * Core hook for all modal-open animations.
 */
export function useModalOpenLogic(props: ModalOpenProps, presets: readonly DemoPreset[]) {
  const { from } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonListRef = useRef<(HTMLButtonElement | null)[]>([])

  const isDemoMode = from === undefined
  const [demoConfig, setDemoConfig] = useState<DemoConfig | null>(null)
  const [phase, setPhase] = useState<Phase>(isDemoMode ? 'idle' : 'opening')
  const [fromPoint, setFromPoint] = useState<ResolvedPoint | null>(null)
  const [center, setCenter] = useState<ResolvedPoint | null>(null)
  const [contentRevealed, setContentRevealed] = useState(false)

  const vals = resolveEffectiveValues(props, demoConfig, isDemoMode)
  const phases = usePhaseLogic(
    phase,
    setPhase,
    fromPoint,
    vals.effectiveDuration,
    vals.effectiveReveal,
    props.onAnimationComplete,
    setContentRevealed,
    setDemoConfig,
    setFromPoint
  )

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || isDemoMode) return
    setCenter(containerCenter(container))
    setFromPoint(resolvePointRelative(from, container))
  }, [from, isDemoMode])

  const handleDemoClick = useDemoClickHandler(
    containerRef,
    buttonListRef,
    presets,
    setCenter,
    setFromPoint,
    setDemoConfig,
    setPhase
  )

  const isVisible = phase !== 'idle'
  const isClosing = phase === 'closing'

  return useMemo(
    () => ({
      containerRef,
      buttonListRef,
      isDemoMode,
      phase,
      isVisible,
      isClosing,
      force: vals.force,
      overlayOpacity: vals.overlayOpacity,
      activeDurationS: isClosing ? vals.closeDurationS : vals.durationS,
      activeDurationMs: isClosing ? vals.closeDurationMs : vals.effectiveDuration,
      fromPoint,
      center,
      contentRevealed,
      handleDemoClick,
      ...phases,
    }),
    [
      isDemoMode,
      phase,
      isVisible,
      isClosing,
      vals,
      fromPoint,
      center,
      contentRevealed,
      handleDemoClick,
      phases,
    ]
  )
}
