import './LoadingStatesRingMulti.css'

export function LoadingStatesRingMulti() {
  return (
    <div data-animation-id="loading-states__ring-multi" className="pf-loading-container">
      <div className="pf-ring-multi">
        <span className="pf-ring-multi__segment"></span>
        <span className="pf-ring-multi__segment"></span>
        <span className="pf-ring-multi__segment"></span>
      </div>
    </div>
  )
}
