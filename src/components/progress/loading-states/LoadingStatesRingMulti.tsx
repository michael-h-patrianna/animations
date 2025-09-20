import './loading-states.css';

export function LoadingStatesRingMulti() {
  return (
    <div data-animation-id="loading-states__ring-multi" className="pf-loading-container">
      <div className="pf-ring-multi">
        <span className="pf-ring-multi__segment" style={{
          width: '40px',
          height: '40px',
          borderColor: '#c47ae5',
          opacity: 0.8
        }}></span>
        <span className="pf-ring-multi__segment" style={{
          width: '50px',
          height: '50px',
          borderColor: '#c6ff77',
          opacity: 0.6
        }}></span>
        <span className="pf-ring-multi__segment" style={{
          width: '60px',
          height: '60px',
          borderColor: '#47fff4',
          opacity: 0.4
        }}></span>
      </div>
    </div>
  );
}
