import './loading-states.css';

export function LoadingStatesSkeletonVertical() {
  return (
    <div data-animation-id="loading-states__skeleton-vertical" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-vertical">
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
      </div>
    </div>
  );
}
