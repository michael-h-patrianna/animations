import './CollectionEffectsCoinCollectPath.css'

export function CollectionEffectsCoinCollectPath() {
  return (
    <div
      className="coin-collect-path-container"
      data-animation-id="collection-effects__coin-collect-path"
    >
      <div className="coin-collect-path-stage">
        {/* Destination indicator */}
        <div className="coin-collect-path-destination" aria-hidden="true">
          <div className="coin-collect-path-destination__inner">Balance</div>
        </div>

        {/* Flying coin */}
        <div className="coin-collect-path-coin" aria-label="Coin collected">
          <div className="coin-collect-path-coin__inner">🪙</div>
        </div>
      </div>
    </div>
  )
}
