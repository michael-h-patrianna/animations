import * as m from 'motion/react-m'
import { PremiumCard } from '../PremiumCard'

/**
 *
 */
export function CardInteractionsSheenSweep() {
  return (
    <m.div 
      className="premium-card-container relative overflow-hidden rounded-2xl group" 
      data-animation-id="card-interactions__sheen-sweep"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <PremiumCard />
      
      {/* Iridescent Wave Layer - Matched to CSS */}
      <m.div
        className="absolute top-0 bottom-0 left-[-100%] w-[150%] z-20 pointer-events-none mix-blend-overlay"
        style={{ 
          skewX: -20, 
          background: "linear-gradient(60deg, transparent 20%, rgba(255, 255, 255, 0.1) 25%, rgba(236, 72, 153, 0.2) 30%, rgba(99, 102, 241, 0.2) 35%, rgba(255, 255, 255, 0.4) 40%, transparent 45%)"
        }}
        variants={{
          rest: { x: "0%" },
          hover: { x: "200%" }
        }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      />
    </m.div>
  )
}