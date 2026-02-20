import React from 'react'

export function MockCardContent() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50">
      <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
           <div className="w-4 h-4 bg-white/80 rounded-full" />
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-slate-600/50 rounded animate-pulse" />
        <div className="h-3 w-full bg-slate-700/50 rounded animate-pulse delay-75" />
        <div className="h-3 w-5/6 bg-slate-700/50 rounded animate-pulse delay-150" />
        
        <div className="mt-auto flex gap-2">
          <div className="h-6 w-16 bg-indigo-500/20 rounded-full border border-indigo-500/30" />
          <div className="h-6 w-16 bg-purple-500/20 rounded-full border border-purple-500/30" />
        </div>
      </div>
    </div>
  )
}
