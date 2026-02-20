import * as m from 'motion/react-m'
import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'

export function CardInteractionsNeonGlow() {
  return (
    <div className="premium-card-container relative group" data-animation-id="card-interactions__neon-glow">
      {/* Aurora Layers - Behind */}
      <m.div 
        className="absolute inset-0 bg-blue-500/40 blur-[50px] rounded-full mix-blend-screen"
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          x: [-20, 20, -20],
          y: [-10, 10, -10]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div 
        className="absolute inset-0 bg-purple-500/40 blur-[50px] rounded-full mix-blend-screen"
        animate={{ 
          scale: [1.1, 0.9, 1.1],
          x: [20, -20, 20],
          y: [15, -15, 15]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Card Content - Increased transparency to let aurora show through */}
      <PremiumCard className="bg-slate-900/30 backdrop-blur-md border-white/10 group-hover:border-white/30 transition-colors duration-500" />
    </div>
  )
}
