import React from 'react'

/**
 *
 */
export function PremiumCard({ 
  children, 
  className = "",
  showGlow = true
}: { 
  children?: React.ReactNode
  className?: string
  showGlow?: boolean
}) {
  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 ${className}`}>
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Subtle Gradient Blob (Ambient Light) */}
      {showGlow && (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      )}
      {showGlow && (
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col p-6">
        {/* Header / Chip */}
        <div className="flex justify-between items-start mb-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-md flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
          </div>
          <div className="px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
             <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Pro Access</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
            Cyberpunk<br/>Glitch
          </h3>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            Holographic interface with real-time physics and chromatic aberration.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          <span className="text-[10px] text-slate-500 font-mono">ID: 884-XJ</span>
        </div>
        
        {children}
      </div>
    </div>
  )
}
