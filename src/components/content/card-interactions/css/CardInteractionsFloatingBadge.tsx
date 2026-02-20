import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'
import './CardInteractionsFloatingBadge.css'

/**
 *
 */
export function CardInteractionsFloatingBadge() {
  return (
    <div className="premium-card-container pf-card-interactions--floating-badge" data-animation-id="card-interactions__floating-badge">
      <PremiumCard />
      <div className="pf-orbital-badge">
        <div className="pf-badge-ping">
           <div className="pf-ping-ring" />
           <div className="pf-ping-dot" />
        </div>
        <span>UPDATES</span>
        <span className="pf-badge-count">3</span>
      </div>
    </div>
  )
}