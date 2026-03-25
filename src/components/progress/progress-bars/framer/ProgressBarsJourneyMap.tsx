/**
 * Journey Map Progress Bar
 *
 * Distance-tracker progress bar with a traveling avatar, destination
 * beacon, tick marks, and distance metadata. In demo mode cycles
 * continuously. In controlled mode shows the given position.
 *
 * @example
 * ```tsx
 * <ProgressBarsJourneyMap
 *   progress={0.45}
 *   totalDistance={520}
 *   unit="km"
 *   label="Journey Distance"
 * />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--journey-track-color`   — track/rail background
 * - `--journey-fill-color`    — fill color
 * - `--journey-text-color`    — text color
 * - `--journey-glow-color`    — traveler glow
 *
 * Files to copy: this file + ProgressBarsJourneyMap.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import { useDemoProgress } from '@/components/progress/progress-bars/SharedDemoLoop'

interface JourneyMapProps extends ProgressBarProps {
  /** Total distance value for display. Default: 520. */
  totalDistance?: number
  /** Distance unit label. Default: "km". */
  unit?: string
  /** Header label. Default: "Journey Distance". */
  label?: string
  /** Traveler icon URL. Fallback: SVG drone. */
  travelerIcon?: string
  /** Destination icon URL. Fallback: SVG beacon. */
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
  const isDemo = progress === undefined
  const demoDuration = 8000
  const displayProgress = useDemoProgress(progress, { duration: demoDuration, pause: 1200 })
  const percent = displayProgress * 100
  const covered = Math.round(displayProgress * totalDistance)
  const remaining = Math.max(0, totalDistance - covered)

  return (
    <div
      className={`journey-distance-wrap${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__journey-map"
    >
      <div className="journey-distance-meta">
        <span className="journey-distance-label">{label}</span>
        <span className="journey-distance-value">
          {covered} {unit}
        </span>
      </div>

      <div className="journey-distance-shell">
        <div className="journey-distance-rail">
          <div className="journey-distance-track" />

          <m.div
            className="journey-distance-fill"
            initial={isDemo ? { width: '0%' } : false}
            animate={
              isDemo
                ? {
                    width: '100%',
                    transition: {
                      duration: demoDuration / 1000,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatDelay: 1.2,
                    },
                  }
                : { width: `${percent}%` }
            }
            transition={isDemo ? undefined : { duration: 0.18, ease: [0.24, 0.78, 0.28, 0.98] }}
            style={{ animation: 'none' }}
          >
            <m.div
              className="journey-distance-traveller"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
              style={{ animation: 'none' }}
            >
              <m.span
                className="journey-distance-traveller-glow"
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.88, 1.12, 0.88] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ animation: 'none' }}
              />
              <span className="journey-distance-traveller-core">
                {travelerIcon !== undefined ? (
                  <img className="journey-distance-traveller-icon" src={travelerIcon} alt="" />
                ) : (
                  <span className="journey-distance-traveller-icon">
                    <DroneFallback />
                  </span>
                )}
              </span>
            </m.div>
          </m.div>

          <m.span
            className="journey-distance-fill-gloss"
            animate={{ x: ['-12%', '120%'], opacity: [0, 0.65, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ animation: 'none' }}
          />

          <div className="journey-distance-ticks">
            {Array.from({ length: TICK_COUNT }, (_, i) => (
              <span key={i} className="journey-distance-tick" />
            ))}
          </div>
        </div>

        <div className="journey-distance-goal">
          {destinationIcon !== undefined ? (
            <img className="journey-distance-goal-icon" src={destinationIcon} alt="" />
          ) : (
            <span className="journey-distance-goal-icon">
              <BeaconFallback />
            </span>
          )}
        </div>
      </div>

      <div className="journey-distance-foot">
        <span>
          {remaining} {unit} to beacon
        </span>
        <span>{Math.floor(percent)}%</span>
      </div>
    </div>
  )
}
