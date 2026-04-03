/**
 * Circular Level Progress
 *
 * SVG ring progress indicator with level-up detection and aura burst.
 * When progress crosses integer boundaries (level-ups), plays a
 * fill → aura-burst → reset sequence. Handles multi-level jumps.
 * Center displays formatted percentage text.
 *
 * Progress encoding: integer part = completed levels, fractional = current fill.
 * Example: 2.44 = "2 levels completed, 44% into next level"
 *
 * @example
 * ```tsx
 * <ProgressBarsCircularLevel progress={1.44} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--circular-level-track`    — track ring color
 * - `--circular-level-fill`     — progress fill color
 * - `--circular-level-aura`     — primary aura burst color
 * - `--circular-level-aura-alt` — secondary aura burst color
 * - `--circular-level-text`     — center text color
 * - `--circular-level-size`     — ring diameter
 *
 * Copy-paste files: this file + ProgressBarsCircularLevel.module.css
 * Runtime deps: react, motion
 */
import * as m from 'motion/react-m'
import { animate, useMotionValue, useReducedMotion } from 'motion/react'
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
  /**
   * Total accumulated progress. Integer part = completed levels,
   * fractional part = current level fill.
   * Example: 2.44 = "2 levels completed, 44% into next"
   */
  progress?: number
  /** Ring stroke width in pixels. Default: 8. */
  strokeWidth?: number
  className?: string
  style?: CSSProperties
}

/**
 * Format a 0–100 percentage for display.
 * < 0.5 → "0%", 0.5–0.94 → ".5%"–".9%", ≥ 0.95 → rounded integer capped at 99.
 */
function formatProgress(pct: number): string {
  if (pct < 0.5) return '0%'
  if (pct < 0.95) return `.${Math.floor(pct * 10)}%`
  return `${Math.min(Math.round(pct), 99)}%`
}

const FILL_BASE_S = 0.4
const BURST_HOLD_MS = 450
const RESET_GAP_MS = 40
const INTERMEDIATE_S = 0.3

function ProgressBarsCircularLevelComponent({
  progress = 0,
  strokeWidth = 8,
  className,
  style,
}: ProgressBarsCircularLevelProps) {
  const prefersReducedMotion = useReducedMotion()
  // SVG geometry — viewBox is 100×100, stroke scaled proportionally
  // Size comes from CSS custom property; default 120px → svgStroke ≈ 6.67
  const svgStroke = (strokeWidth / 120) * 100
  const radius = 50 - svgStroke / 2
  const circumference = 2 * Math.PI * radius

  // Core motion value: current fill fraction (0–1)
  const fillMV = useMotionValue(Math.max(0, progress) % 1)
  const circleRef = useRef<SVGCircleElement>(null)

  // Tracking refs
  const prevFloorRef = useRef(Math.floor(Math.max(0, progress)))
  const animatingRef = useRef(false)
  const mountedRef = useRef(true)

  // Display text driven by ref to avoid per-frame React re-renders during animation
  const textRef = useRef<HTMLSpanElement>(null)

  // Aura burst instances (key-mounted)
  const [bursts, setBursts] = useState<number[]>([])
  const burstIdRef = useRef(0)

  // Re-evaluation trigger after animation completes
  const [syncTrigger, setSyncTrigger] = useState(0)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Set initial text before paint
  useLayoutEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = formatProgress(fillMV.get() * 100)
    }
  }, [fillMV])

  // Drive SVG circle + text from fill motion value (avoids m.circle for RN compat)
  useEffect(() => {
    return fillMV.on('change', (v) => {
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(circumference * (1 - v))
      }
      if (textRef.current) {
        textRef.current.textContent = formatProgress(v * 100)
      }
    })
  }, [fillMV, circumference])

  const triggerAura = useCallback(() => {
    const id = burstIdRef.current++
    setBursts((p) => [...p, id])
    setTimeout(() => {
      if (mountedRef.current) setBursts((p) => p.filter((x) => x !== id))
    }, 700)
  }, [])

  const wait = useCallback((ms: number) => new Promise<void>((r) => setTimeout(r, ms)), [])

  const runLevelUp = useCallback(
    async (levels: number, finalFill: number) => {
      // Phase 1: fill current position → 100%
      const cur = fillMV.get()
      await animate(fillMV, 1, {
        duration: Math.max(0.15, FILL_BASE_S * (1 - cur)),
        ease: 'easeOut',
      })

      // Phase 2: for each level, burst → reset → optional intermediate fill
      for (let i = 0; i < levels; i++) {
        if (!mountedRef.current) return
        triggerAura()
        await wait(BURST_HOLD_MS)
        if (!mountedRef.current) return

        fillMV.jump(0)
        await wait(RESET_GAP_MS)

        // Intermediate full fill for multi-level jumps
        if (i < levels - 1) {
          await animate(fillMV, 1, { duration: INTERMEDIATE_S, ease: 'linear' })
        }
      }

      // Phase 3: fill to final position
      if (!mountedRef.current) return
      if (finalFill > 0.005) {
        await animate(fillMV, finalFill, {
          duration: Math.max(0.1, FILL_BASE_S * finalFill),
          ease: 'easeOut',
        })
      }

      animatingRef.current = false
      setSyncTrigger((n) => n + 1)
    },
    [fillMV, triggerAura, wait]
  )

  // React to progress changes + catch-up after animation completes
  useEffect(() => {
    const safe = Math.max(0, progress)
    const currentFloor = Math.floor(safe)
    const prevFloor = prevFloorRef.current
    const levelsGained = currentFloor - prevFloor
    const fill = safe % 1

    if (prefersReducedMotion) {
      // Skip all animations — jump to final state immediately
      prevFloorRef.current = currentFloor
      fillMV.jump(fill)
      return
    }

    if (levelsGained > 0 && !animatingRef.current) {
      prevFloorRef.current = currentFloor
      animatingRef.current = true
      runLevelUp(levelsGained, fill)
    } else if (!animatingRef.current) {
      prevFloorRef.current = currentFloor
      animate(fillMV, fill, { duration: 0.25, ease: [0.4, 0, 0.2, 1] })
    }
    // When animating: skip — syncTrigger will re-run this after animation
  }, [progress, syncTrigger, fillMV, runLevelUp, prefersReducedMotion])

  return (
    <div
      className={`${styles['pf-circular-level-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__circular-level"
    >
      <div
        className={styles['pf-circular-level-fm__wrapper']}
        role="progressbar"
        aria-valuenow={Math.round((Math.max(0, progress) % 1) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Aura burst rings — key-mounted per burst */}
        {bursts.map((id) => (
          <div key={id} className={styles['pf-circular-level-fm__aura-host']}>
            <m.div
              className={`${styles['pf-circular-level-fm__aura']} ${styles['pf-circular-level-fm__aura--primary']}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.95, 1.08, 1.15] }}
              transition={{ duration: 0.5, ease: 'easeOut', times: [0, 0.4, 1] }}
            />
            <m.div
              className={`${styles['pf-circular-level-fm__aura']} ${styles['pf-circular-level-fm__aura--secondary']}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.95, 1.05, 1.1] }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.04, times: [0, 0.5, 1] }}
            />
          </div>
        ))}

        {/* SVG ring */}
        <svg className={styles['pf-circular-level-fm__ring']} viewBox="0 0 100 100">
          <circle
            className={styles['pf-circular-level-fm__track']}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={svgStroke}
          />
          <circle
            ref={circleRef}
            className={styles['pf-circular-level-fm__fill']}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={svgStroke}
            strokeDasharray={circumference}
            style={{ strokeDashoffset: circumference * (1 - fillMV.get()) }}
          />
        </svg>

        {/* Center percentage text — content driven by fillMV.on('change') ref updates */}
        <span ref={textRef} className={styles['pf-circular-level-fm__text']} />
      </div>
    </div>
  )
}

export const ProgressBarsCircularLevel = memo(ProgressBarsCircularLevelComponent)
