import * as m from 'motion/react-m'
import { PremiumCard } from '../PremiumCard'

/**
 *
 */
export function CardInteractionsBorderGradient() {
  return (
    <div 
      className="premium-card-container relative p-[1.5px] rounded-2xl overflow-hidden group" 
      data-animation-id="card-interactions__border-gradient"
    >
      {/* Moving Gradient Background - Sharper */}
      <m.div
        className="absolute inset-[-100%]"
        style={{
          // eslint-disable-next-line animation-rules/no-radial-angular-gradient -- radial effect required for visual design
          background: "conic-gradient(from 0deg, transparent 0deg, #6366f1 90deg, #a855f7 180deg, #ec4899 270deg, transparent 360deg)"
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Glow Layer - Softer */}
      <m.div
        className="absolute inset-[-100%] opacity-70 blur-md mix-blend-screen"
        style={{
          // eslint-disable-next-line animation-rules/no-radial-angular-gradient -- radial effect required for visual design
          background: "conic-gradient(from 0deg, transparent 0deg, #6366f1 90deg, #a855f7 180deg, #ec4899 270deg, transparent 360deg)"
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Card (Opaque) - slightly smaller radius to show border */}
      <div className="relative z-10 w-full h-full bg-slate-950/90 rounded-[14px] overflow-hidden backdrop-blur-xl">
        <PremiumCard showGlow={false} className="border-none bg-transparent" />
      </div>
    </div>
  )
}
