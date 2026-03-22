/**
 * Stamina Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsStamina.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import type { ProgressBarProps } from '../SharedTypes'
import { useDemoPingPong } from '../SharedDemoLoop'
import './ProgressBarsStamina.css'

interface StaminaProps extends ProgressBarProps {
  label?: string
  icon?: string
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
      className={`stamina-wrap-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__stamina"
    >
      <div className="stamina-head-css">
        <div className="stamina-icon-shell-css">
          {icon !== undefined ? (
            <img className="stamina-icon-css" src={icon} alt="" />
          ) : (
            <span className="stamina-icon-css stamina-icon--fallback-css">
              <CrystalFallback />
            </span>
          )}
        </div>

        <div className="stamina-stats-css">
          <span className="stamina-title-css">{label}</span>
          <span className={`stamina-mode-css ${isDraining ? 'drain' : 'charge'}`}>
            {isDraining ? 'Drain' : 'Recharge'}
          </span>
        </div>

        <span className="stamina-number-css">{Math.round(percent)}</span>
      </div>

      <div className="stamina-bar-css">
        <div
          className={`stamina-bar-fill-css${isLow ? ' low' : ''} ${isDraining ? 'drain' : 'charge'}`}
          style={{ width: `${percent}%` }}
        />
        <div className="stamina-bar-segments-css">
          {Array.from({ length: SEGMENT_COUNT }, (_, i) => {
            const threshold = ((i + 1) / SEGMENT_COUNT) * 100
            return (
              <span
                key={threshold}
                className={`stamina-bar-segment-css${percent >= threshold ? ' active' : ''}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
