import React from 'react'

export function MockImageCard({ showContent = true }: { showContent?: boolean }) {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-800">
      {/* Pattern Background acting as Image */}
      <div className="absolute inset-0 bg-indigo-500/20">
         <div className="w-full h-full opacity-30" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)', 
            backgroundSize: '24px 24px' 
         }} />
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-700/50 mix-blend-overlay" />
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      {showContent && (
        <div className="absolute bottom-0 left-0 p-5 w-full">
          <h3 className="text-white font-bold text-lg mb-1">Neon Nights</h3>
          <p className="text-slate-300 text-sm leading-snug">Explore the cyber-enhanced cityscapes of the future.</p>
        </div>
      )}
    </div>
  )
}
