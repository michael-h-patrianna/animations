import './LoadingStatesSkeletonCard.css'

export function LoadingStatesSkeletonCard() {
  return (
    <div data-animation-id="loading-states__skeleton-card" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-card">
        <div className="pf-skeleton__line pf-skeleton__title"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
      </div>
    </div>
  )
}
