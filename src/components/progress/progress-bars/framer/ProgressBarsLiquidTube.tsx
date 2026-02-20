import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'

/**
 *
 */
export function ProgressBarsLiquidTube() {
  const [progress, setProgress] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 90 ? 10 : p + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="liquid-tube-container" data-animation-id="progress-bars__liquid-tube">
      <div className="liquid-tube-glass">
        <m.div 
          className="liquid-tube-fill"
          animate={{ height: `${progress}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        >
           <div className="liquid-tube-surface">
             <m.div 
                className="liquid-wave"
                animate={{ x: ['-50%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             />
           </div>
           {/* Bubbles */}
           {[1, 2, 3].map(i => (
             <m.div 
               key={i}
               className="liquid-bubble"
               style={{ left: `${20 + i * 20}%` }}
               animate={{ 
                 y: [0, -100], 
                 opacity: [0, 1, 0] 
               }}
               transition={{ 
                 duration: 2 + i, 
                 repeat: Infinity, 
                 delay: i * 0.5,
                 ease: "easeIn"
               }}
             />
           ))}
        </m.div>
      </div>
    </div>
  )
}
