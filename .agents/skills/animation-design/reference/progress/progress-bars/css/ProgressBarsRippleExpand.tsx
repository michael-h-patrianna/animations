import './ProgressBarsRippleExpand.css'

export function ProgressBarsRippleExpand() {
  return (
    <div
      className="pf-progress-demo pf-progress-ripple-expand"
      data-animation-id="progress-bars__ripple-expand"
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
            {/* Ripple rings - staggered expansion */}
            <div className="pf-ripple pf-ripple-1" aria-hidden="true" />
            <div className="pf-ripple pf-ripple-2" aria-hidden="true" />
            <div className="pf-ripple pf-ripple-3" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
