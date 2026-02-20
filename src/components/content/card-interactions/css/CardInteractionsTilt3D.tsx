import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'
import './CardInteractionsTilt3D.css'

/**
 *
 */
export function CardInteractionsTilt3D() {
  return (
    <div
      className="premium-card-container pf-card-interactions--tilt-3d"
      data-animation-id="card-interactions__tilt-3d"
    >
      <div className="pf-tilt-inner">
        <PremiumCard />
        <div className="pf-tilt-glare" />
      </div>
    </div>
  )
}