import './loading-states.css';

export function LoadingStatesSkeletonTile() {
  return (
    <div data-animation-id="loading-states__skeleton-tile" className="pf-loading-container">
      <div className="pf-skeleton-tile">
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
      </div>
    </div>
  );
}
