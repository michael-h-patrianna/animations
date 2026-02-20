import * as m from 'motion/react-m'
import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'

export function CardInteractionsFloatingBadge() {
  return (
    <m.div 
      className="premium-card-container relative" 
      data-animation-id="card-interactions__floating-badge"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <PremiumCard />
      
      {/* Orbital Badge */}
      <m.div
        className="absolute top-6 right-6 z-20 cursor-pointer"
        variants={{
          rest: { y: 0, scale: 1, rotate: 0 },
          hover: { 
            y: -8, 
            scale: 1.1, 
            rotate: 0,
            transition: { type: "spring", stiffness: 300, damping: 15 }
          }
        }}
      >
        <m.div 
          className="relative"
          variants={{
            rest: { rotate: 0 },
            hover: { 
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.4, ease: "easeInOut" }
            }
          }}
        >
          {/* Ping Effect */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          
          <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 shadow-lg backdrop-blur-md flex items-center gap-2">
            <span>UPDATES</span>
            <span className="bg-white/10 px-1.5 rounded text-[10px]">3</span>
          </div>
        </m.div>
      </m.div>
    </m.div>
  )
}
