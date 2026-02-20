import * as m from 'motion/react-m'
import '../shared-premium.css'

export function CardInteractionsContentSlideUp() {
  return (
    <m.div 
      className="premium-card-container overflow-hidden rounded-2xl group cursor-pointer" 
      data-animation-id="card-interactions__content-slide-up"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
       <div className="h-full w-full bg-slate-950 p-6 flex flex-col items-center justify-center border border-white/10 rounded-2xl relative">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-white font-bold tracking-widest text-sm mb-2">RESTRICTED AREA</h3>
          <p className="text-slate-500 text-xs font-mono">HOVER TO AUTHENTICATE</p>
       </div>

       {/* Slide Up Glass Panel */}
       <m.div 
         className="absolute inset-x-0 bottom-0 h-[80%] bg-slate-900/90 backdrop-blur-xl border-t border-white/20 p-6 flex flex-col z-20"
         variants={{
           rest: { y: "100%" },
           hover: { y: "0%" }
         }}
         transition={{ type: "spring", stiffness: 200, damping: 20 }}
       >
         <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
         
         <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
               <span className="text-slate-400 text-sm">Status</span>
               <span className="text-green-400 text-sm font-bold shadow-[0_0_10px_rgba(74,222,128,0.5)] rounded px-2">GRANTED</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
               <span className="text-slate-400 text-sm">Clearance</span>
               <span className="text-white text-sm font-mono">LEVEL 5</span>
            </div>
            <div className="mt-4">
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-bold transition-colors">
                ENTER SYSTEM
              </button>
            </div>
         </div>
       </m.div>
    </m.div>
  )
}
