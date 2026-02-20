import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'
import './CardInteractionsSpotlight.css'

/**
 *
 */
export function CardInteractionsSpotlight() {
  return (
    <div 
      className="premium-card-container pf-card-interactions--spotlight"
      data-animation-id="card-interactions__spotlight"
    >
      <div className="pf-spotlight-beam" />
      <div className="pf-spotlight-border" />
      <div className="pf-spotlight-content">
        {/* Pass transparency to allow background pattern to show through if needed, 
            or rely on the overlays being on top. 
            The Framer version puts overlays ON TOP of the card.
            So here beam/border are z-10/20, content is z-5? 
            Wait, content must be interactive.
            Framer: Texture is absolute z-20 (pointer-events-none).
            So here: Beam/Border should be z-20 pointer-events-none.
            Content z-10.
        */}
        <PremiumCard showGlow={false} />
      </div>
    </div>
  )
}
