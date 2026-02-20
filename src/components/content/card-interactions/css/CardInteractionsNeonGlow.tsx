import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'
import './CardInteractionsNeonGlow.css'

/**
 *
 */
export function CardInteractionsNeonGlow() {
  return (
    <div 
      className="premium-card-container pf-card-interactions--neon-glow"
      data-animation-id="card-interactions__neon-glow"
    >
      <div className="pf-aurora-blob pf-aurora-1" />
      <div className="pf-aurora-blob pf-aurora-2" />
      <PremiumCard className="bg-slate-900/40 backdrop-blur-md border-white/10" />
    </div>
  )
}