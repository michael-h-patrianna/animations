/**
 * Circular Level Progress — CSS variant
 *
 * SVG ring progress with level-up detection, CSS transition-driven fill,
 * and CSS keyframe aura burst. Center text interpolated via rAF.
 *
 * Copy-paste files: this file + ProgressBarsCircularLevel.css
 * Runtime deps: react
 */
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import styles from './ProgressBarsCircularLevel.module.css'

interface ProgressBarsCircularLevelProps {
  progress?: number
  strokeWidth?: number
  className?: string
  style?: CSSProperties
}

function formatProgress(pct: number): string {
  if (pct < 0.5) return '0%'
  if (pct < 0.95) return `.${Math.floor(pct * 10)}%`
  return `${Math.min(Math.round(pct), 99)}%`
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

const FILL_BASE_MS = 400
const BURST_HOLD_MS = 450
const RESET_GAP_MS = 40
const INTERMEDIATE_MS = 300

function ProgressBarsCircularLevelCssComponent({
  progress = 0,
  strokeWidth = 8,
  className,
  style,
}: ProgressBarsCircularLevelProps) {
  const svgStroke = (strokeWidth / 120) * 100
  const radius = 50 - svgStroke / 2
  const circumference = 2 * Math.PI * radius

  // Refs for animation state
  const prevFloorRef = useRef(Math.floor(Math.max(0, progress)))
  const animatingRef = useRef(false)
  const mountedRef = useRef(true)
  const fillRef = useRef(Math.max(0, progress) % 1)
  const rafRef = useRef(0)

  // Visual state
  const [circleStyle, setCircleStyle] = useState<CSSProperties>(() => ({
    strokeDashoffset: `${circumference * (1 - fillRef.current)}`,
  }))
  const textRef = useRef<HTMLSpanElement>(null)
  const [bursts, setBursts] = useState<number[]>([])
  const burstIdRef = useRef(0)
  const [syncTrigger, setSyncTrigger] = useState(0)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Set initial text before paint
  useLayoutEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = formatProgress(fillRef.current * 100)
    }
  }, [])

  /** Interpolate text display in sync with CSS transition. */
  const tweenText = useCallback((from: number, to: number, durationMs: number, linear = false) => {
    cancelAnimationFrame(rafRef.current)
    const startTime = performance.now()

    function tick() {
      const elapsed = performance.now() - startTime
      const t = Math.min(1, elapsed / durationMs)
      const eased = linear ? t : easeOutQuad(t)
      const value = from + (to - from) * eased
      fillRef.current = value
      if (textRef.current) textRef.current.textContent = formatProgress(value * 100)
      if (t < 1 && mountedRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const triggerAura = useCallback(() => {
    const id = burstIdRef.current++
    setBursts((p) => [...p, id])
    setTimeout(() => {
      if (mountedRef.current) setBursts((p) => p.filter((x) => x !== id))
    }, 700)
  }, [])

  const waitMs = useCallback((ms: number) => new Promise<void>((r) => setTimeout(r, ms)), [])

  const runLevelUp = useCallback(
    async (levels: number, finalFill: number) => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        fillRef.current = finalFill
        setCircleStyle({ strokeDashoffset: `${circumference * (1 - finalFill)}` })
        if (textRef.current) textRef.current.textContent = formatProgress(finalFill * 100)
        animatingRef.current = false
        setSyncTrigger((n) => n + 1)
        return
      }

      // Phase 1: fill current → 100%
      const cur = fillRef.current
      const fillDur = Math.max(150, FILL_BASE_MS * (1 - cur))
      setCircleStyle({
        strokeDashoffset: '0',
        transition: `stroke-dashoffset ${fillDur}ms ease-out`,
      })
      tweenText(cur, 1, fillDur)
      await waitMs(fillDur)

      // Phase 2: burst + reset for each level
      for (let i = 0; i < levels; i++) {
        if (!mountedRef.current) return
        triggerAura()
        await waitMs(BURST_HOLD_MS)
        if (!mountedRef.current) return

        // Reset to 0
        cancelAnimationFrame(rafRef.current)
        fillRef.current = 0
        if (textRef.current) textRef.current.textContent = formatProgress(0)
        setCircleStyle({ strokeDashoffset: `${circumference}`, transition: 'none' })
        await waitMs(RESET_GAP_MS)

        // Intermediate full fill for multi-level jumps
        if (i < levels - 1) {
          setCircleStyle({
            strokeDashoffset: '0',
            transition: `stroke-dashoffset ${INTERMEDIATE_MS}ms linear`,
          })
          tweenText(0, 1, INTERMEDIATE_MS, true)
          await waitMs(INTERMEDIATE_MS)
        }
      }

      // Phase 3: fill to final position
      if (!mountedRef.current) return
      if (finalFill > 0.005) {
        const dur = Math.max(100, FILL_BASE_MS * finalFill)
        setCircleStyle({
          strokeDashoffset: `${circumference * (1 - finalFill)}`,
          transition: `stroke-dashoffset ${dur}ms ease-out`,
        })
        tweenText(0, finalFill, dur)
        await waitMs(dur)
      }

      animatingRef.current = false
      setSyncTrigger((n) => n + 1)
    },
    [circumference, tweenText, triggerAura, waitMs]
  )

  // React to progress changes + catch-up after animation
  useEffect(() => {
    const safe = Math.max(0, progress)
    const currentFloor = Math.floor(safe)
    const prevFloor = prevFloorRef.current
    const levelsGained = currentFloor - prevFloor
    const fill = safe % 1

    if (levelsGained > 0 && !animatingRef.current) {
      prevFloorRef.current = currentFloor
      animatingRef.current = true
      runLevelUp(levelsGained, fill)
    } else if (!animatingRef.current) {
      prevFloorRef.current = currentFloor
      cancelAnimationFrame(rafRef.current)
      fillRef.current = fill
      if (textRef.current) textRef.current.textContent = formatProgress(fill * 100)

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setCircleStyle({
        strokeDashoffset: `${circumference * (1 - fill)}`,
        transition: prefersReduced
          ? 'none'
          : 'stroke-dashoffset 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      })
    }
  }, [progress, syncTrigger, circumference, runLevelUp])

  return (
    <div
      className={`${styles['pf-circular-level-css']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__circular-level"
    >
      <div className={styles['pf-circular-level-css__wrapper']}>
        {bursts.map((id) => (
          <div key={id} className={styles['pf-circular-level-css__aura-host']}>
            <div
              className={`${styles['pf-circular-level-css__aura']} ${styles['pf-circular-level-css__aura--primary']}`}
            />
            <div
              className={`${styles['pf-circular-level-css__aura']} ${styles['pf-circular-level-css__aura--secondary']}`}
            />
          </div>
        ))}

        <svg className={styles['pf-circular-level-css__ring']} viewBox="0 0 100 100">
          <circle
            className={styles['pf-circular-level-css__track']}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={svgStroke}
          />
          <circle
            className={styles['pf-circular-level-css__fill']}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={svgStroke}
            strokeDasharray={circumference}
            style={circleStyle}
          />
        </svg>

        <span ref={textRef} className={styles['pf-circular-level-css__text']} />
      </div>
    </div>
  )
}

export const ProgressBarsCircularLevel = memo(ProgressBarsCircularLevelCssComponent)
