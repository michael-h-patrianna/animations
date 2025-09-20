import './loading-states.css';

export function LoadingStatesDotsWave() {
  return (
    <div data-animation-id="loading-states__dots-wave" className="pf-loading-container">
      <div className="pf-dots pf-dots-wave">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
