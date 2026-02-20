import './ProgressBarsGlowTrail.css'

export function ProgressBarsGlowTrail() {
  return (
    <div
      className="pf-progress-demo pf-progress-glow-trail"
      data-animation-id="progress-bars__glow-trail"
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
            <div className="pf-glow-overlay" />
          </div>
        </div>
      </div>
    </div>
  )
}
