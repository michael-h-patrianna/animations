/**
 * Journey Map Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsJourneyMap.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import './ProgressBarsJourneyMap.css'

interface JourneyMapProps extends ProgressBarProps {
  totalDistance?: number
  unit?: string
  label?: string
  travelerIcon?: string
  destinationIcon?: string
}

const TICK_COUNT = 22

function DroneFallback() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <circle cx="12" cy="12" r="4" opacity="0.9" />
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  )
}

function BeaconFallback() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" opacity="0.7">
      <path d="M12 2L8 10h8zM12 22V10" />
      <circle cx="12" cy="6" r="2" />
    </svg>
  )
}

export function ProgressBarsJourneyMap({
  progress,
  totalDistance = 520,
  unit = 'km',
  label = 'Journey Distance',
  travelerIcon,
  destinationIcon,
  className,
  style,
}: JourneyMapProps) {
  const displayProgress = progress ?? 0
  const percent = displayProgress * 100
  const covered = Math.round(displayProgress * totalDistance)
  const remaining = Math.max(0, totalDistance - covered)

  return (
    <div
      className={`journey-distance-wrap-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__journey-map"
    >
      <div className="journey-distance-meta-css">
        <span className="journey-distance-label-css">{label}</span>
        <span className="journey-distance-value-css">
          {covered} {unit}
        </span>
      </div>

      <div className="journey-distance-shell-css">
        <div className="journey-distance-rail-css">
          <div className="journey-distance-track-css" />
          <div className="journey-distance-fill-css" style={{ width: `${percent}%` }}>
            <div className="journey-distance-traveller-css">
              <span className="journey-distance-traveller-glow-css" />
              <span className="journey-distance-traveller-core-css">
                {travelerIcon !== undefined ? (
                  <img className="journey-distance-traveller-icon-css" src={travelerIcon} alt="" />
                ) : (
                  <span className="journey-distance-traveller-icon-css">
                    <DroneFallback />
                  </span>
                )}
              </span>
            </div>
          </div>
          <span className="journey-distance-fill-gloss-css" />
          <div className="journey-distance-ticks-css">
            {Array.from({ length: TICK_COUNT }, (_, i) => (
              <span key={i} className="journey-distance-tick-css" />
            ))}
          </div>
        </div>
        <div className="journey-distance-goal-css">
          {destinationIcon !== undefined ? (
            <img className="journey-distance-goal-icon-css" src={destinationIcon} alt="" />
          ) : (
            <span className="journey-distance-goal-icon-css">
              <BeaconFallback />
            </span>
          )}
        </div>
      </div>

      <div className="journey-distance-foot-css">
        <span>
          {remaining} {unit} to beacon
        </span>
        <span>{Math.floor(percent)}%</span>
      </div>
    </div>
  )
}
