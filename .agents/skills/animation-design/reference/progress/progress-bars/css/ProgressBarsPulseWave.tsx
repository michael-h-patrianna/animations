import './ProgressBarsPulseWave.css'

export function ProgressBarsPulseWave() {
  return (
    <div
      className="pf-progress-demo pf-progress-pulse-wave"
      data-animation-id="progress-bars__pulse-wave"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          <div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={70}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* 4 wave overlays with staggered animations */}
            <div className="wave-overlay" />
            <div className="wave-overlay" />
            <div className="wave-overlay" />
            <div className="wave-overlay" />
          </div>
        </div>
      </div>
    </div>
  )
}
