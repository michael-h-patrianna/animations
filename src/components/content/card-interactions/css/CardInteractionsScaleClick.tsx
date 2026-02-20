import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'
import './CardInteractionsScaleClick.css'

/**
 *
 */
export function CardInteractionsScaleClick() {
  return (
    <div className="premium-card-container pf-card-interactions--scale-click" data-animation-id="card-interactions__scale-click">
      <PremiumCard />
      <div className="pf-click-overlay" />
    </div>
  )
}