import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'
import './CardInteractionsSheenSweep.css'

/**
 *
 */
export function CardInteractionsSheenSweep() {
  return (
    <div className="premium-card-container pf-card-interactions--sheen-sweep" data-animation-id="card-interactions__sheen-sweep">
      <PremiumCard />
      <div className="pf-sheen-layer" />
    </div>
  )
}