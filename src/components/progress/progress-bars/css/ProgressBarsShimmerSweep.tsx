import './ProgressBarsShimmerSweep.css'

/**
 *
 */
export function ProgressBarsShimmerSweep() {
  return (
    <div
      className="pf-progress-demo pf-progress-shimmer-sweep"
      data-animation-id="progress-bars__shimmer-sweep"
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
            {/* Shimmer overlay sweeping across progress bar */}
            <div className="shimmer-overlay" />
          </div>
        </div>
      </div>
    </div>
  )
}
