import * as m from 'motion/react-m'
import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'

export function CardInteractionsFlip3D() {
  return (
    <div className="premium-card-container" style={{ perspective: 1500 }}>
      <m.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: 0 }}
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        data-animation-id="card-interactions__flip-3d"
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          <PremiumCard />
        </div>

        {/* Back (The Matrix/Data Layer) */}
        <div 
          className="absolute inset-0 w-full h-full bg-slate-950 rounded-2xl border border-indigo-500/50 overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Animated Matrix Rain Effect (Simplified for React) */}
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(99,102,241,0.2)_50%,rgba(0,0,0,0)_100%)] opacity-30 animate-pulse" />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full border border-indigo-400/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-wider">SYSTEM UNLOCKED</h3>
            <p className="text-indigo-300 text-xs font-mono border-t border-indigo-500/30 pt-4 mt-2 w-full">
              ACCESS_LEVEL: ADMIN<br/>
              ENCRYPTION: 0<br/>
              DATA: REVEALED
            </p>
          </div>
        </div>
      </m.div>
    </div>
  )
}