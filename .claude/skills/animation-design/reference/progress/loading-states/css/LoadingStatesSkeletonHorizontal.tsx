import './LoadingStatesSkeletonHorizontal.css'

export function LoadingStatesSkeletonHorizontal() {
  return (
    <div data-animation-id="loading-states__skeleton-horizontal" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-horizontal">
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
      </div>
    </div>
  )
}
