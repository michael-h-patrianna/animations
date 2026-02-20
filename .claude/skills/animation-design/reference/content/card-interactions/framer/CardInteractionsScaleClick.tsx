import * as m from 'motion/react-m'
import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'

export function CardInteractionsScaleClick() {
  return (
    <m.div
      className="premium-card-container"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95, rotate: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      data-animation-id="card-interactions__scale-click"
    >
      <PremiumCard />
      
      {/* Click Ripple/Highlight Overlay */}
      <m.div 
        className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none opacity-0"
        whileTap={{ opacity: 0.2 }}
      />
    </m.div>
  )
}