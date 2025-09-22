import './LoadingStatesRingProgress.css'

export function LoadingStatesRingProgress() {
  const circumference = 2 * Math.PI * 25

  return (
    <div data-animation-id="loading-states__ring-progress" className="pf-loading-container">
      <div className="pf-ring-progress">
        <svg viewBox="0 0 60 60" width="60" height="60">
          <circle cx="30" cy="30" r="25" fill="none" className="base" strokeWidth="4" />
          <circle
            className="pf-progress-ring"
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#c47ae5"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference}`}
          />
        </svg>
      </div>
    </div>
  )
}
