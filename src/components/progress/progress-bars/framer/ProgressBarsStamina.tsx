/**
 * Stamina Bar
 *
 * Gaming-style segmented stamina bar with drain/recharge modes and
 * low-stamina pulse warning. In demo mode cycles drain→recharge.
 * In controlled mode displays the given value.
 *
 * @example
 * ```tsx
 * <ProgressBarsStamina progress={0.35} label="Energy" mode="drain" />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--stamina-fill-color`   — fill bar color
 * - `--stamina-low-color`    — low-stamina fill color
 * - `--stamina-charge-color` — recharge fill color
 * - `--stamina-track-color`  — track background
 * - `--stamina-text-color`   — text color
 *
 * Files to copy: this file + ProgressBarsStamina.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import type { ProgressBarProps } from '../SharedTypes'
import { useDemoPingPong } from '../SharedDemoLoop'

interface StaminaProps extends ProgressBarProps {
  /** Label text. Default: "Stamina". */
  label?: string
  /** Icon image URL. Fallback: SVG crystal shape. */
  icon?: string
  /** Current display mode. Default determined by demo loop. */
  mode?: 'drain' | 'recharge'
}

const SEGMENT_COUNT = 14

function CrystalFallback() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2L6 10l6 12 6-12z" opacity="0.8" />
      <path d="M12 2l6 8H6z" opacity="0.6" />
    </svg>
  )
}

export function ProgressBarsStamina({
  progress,
  label = 'Stamina',
  icon,
  mode,
  className,
  style,
}: StaminaProps) {
  const demo = useDemoPingPong(progress, { duration: 5200, pause: 400 })
  const stamina = progress !== undefined ? progress : demo.value
  const direction = mode ?? demo.direction
  const isDraining = direction === 'drain' || direction === undefined
  const percent = stamina * 100
  const isLow = percent < 25

  return (
    <div
      className={`stamina-wrap${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__stamina"
    >
      <div className="stamina-head">
        <div className="stamina-icon-shell">
          {icon !== undefined ? (
            <m.img
              className="stamina-icon"
              src={icon}
              alt=""
              animate={isLow ? { scale: [1, 1.08, 1] } : { scale: [1, 1.02, 1] }}
              transition={{ duration: isLow ? 0.5 : 1.7, repeat: Infinity, ease: 'easeInOut' }}
              style={{ animation: 'none' }}
            />
          ) : (
            <m.span
              className="stamina-icon stamina-icon--fallback"
              animate={isLow ? { scale: [1, 1.08, 1] } : { scale: [1, 1.02, 1] }}
              transition={{ duration: isLow ? 0.5 : 1.7, repeat: Infinity, ease: 'easeInOut' }}
              style={{ animation: 'none' }}
            >
              <CrystalFallback />
            </m.span>
          )}
        </div>

        <div className="stamina-stats">
          <span className="stamina-title">{label}</span>
          <span className={`stamina-mode ${isDraining ? 'drain' : 'charge'}`}>
            {isDraining ? 'Drain' : 'Recharge'}
          </span>
        </div>

        <span className="stamina-number">{Math.round(percent)}</span>
      </div>

      <div className="stamina-bar">
        <m.div
          className={`stamina-bar-fill${isLow ? ' low' : ''} ${isDraining ? 'drain' : 'charge'}`}
          animate={{ width: `${percent}%`, opacity: isLow ? [1, 0.72, 1] : 1 }}
          transition={{
            width: { duration: 0.16, ease: [0.24, 0.78, 0.28, 0.98] },
            opacity: isLow
              ? { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.18 },
          }}
          style={{ animation: 'none' }}
        />

        <div className="stamina-bar-segments">
          {Array.from({ length: SEGMENT_COUNT }, (_, i) => {
            const threshold = ((i + 1) / SEGMENT_COUNT) * 100
            return (
              <span
                key={threshold}
                className={`stamina-bar-segment${percent >= threshold ? ' active' : ''}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
