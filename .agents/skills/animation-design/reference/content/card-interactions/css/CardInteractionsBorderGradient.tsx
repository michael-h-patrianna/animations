import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'
import './CardInteractionsBorderGradient.css'

export function CardInteractionsBorderGradient() {
  return (
    <div 
      className="premium-card-container pf-card-interactions--border-gradient"
      data-animation-id="card-interactions__border-gradient"
    >
      <div className="pf-border-gradient-bg" />
      <div className="pf-border-gradient-blur" />
      <div className="pf-border-gradient-content">
        <PremiumCard showGlow={false} className="border-none" />
      </div>
    </div>
  )
}