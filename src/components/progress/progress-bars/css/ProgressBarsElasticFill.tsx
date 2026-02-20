import './ProgressBarsElasticFill.css'

/**
 *
 */
export function ProgressBarsElasticFill() {
  return (
    <div
      className="pf-progress-demo pf-progress-elastic-fill"
      data-animation-id="progress-bars__elastic-fill"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          <div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={70}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  )
}
