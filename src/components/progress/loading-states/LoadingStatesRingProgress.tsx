import './loading-states.css';

export function LoadingStatesRingProgress() {
  const circumference = 2 * Math.PI * 25;

  return (
    <div data-animation-id="loading-states__ring-progress" className="pf-loading-container">
      <div className="pf-ring-progress">
        <svg viewBox="0 0 60 60" width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
          <circle 
            cx="30" 
            cy="30" 
            r="25" 
            fill="none" 
            stroke="rgba(236,195,255,0.2)" 
            strokeWidth="4"
          />
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
  );
}
