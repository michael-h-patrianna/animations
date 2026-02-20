import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'

/**
 *
 */
import { diamondImage as diamondImg, presentBox as boxImg } from '@/assets'
/**
 *
 */
export function RevealEffectsChestGlowOpen() {
  const [phase, setPhase] = useState<'idle' | 'shake' | 'flash' | 'reveal'>('idle')

  useEffect(() => {
    // Sequence: Idle -> Shake (500ms) -> Flash/Reveal (1200ms)
    const t1 = setTimeout(() => setPhase('shake'), 200)
    const t2 = setTimeout(() => setPhase('flash'), 1200)
    const t3 = setTimeout(() => setPhase('reveal'), 1250) // slightly after flash starts

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div className="reveal-chest-glow-container">
        <div className="reveal-chest-glow-wrapper">
            {/* Aura Background (Only during reveal) */}
            <m.div 
                className="reveal-chest-glow-aura"
                initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
                animate={phase === 'reveal' ? { scale: 1.5, opacity: [0.4, 0.6, 0.4] } : { scale: 0, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Mystery Box */}
            <m.img 
                src={boxImg}
                className="reveal-chest-box"
                animate={phase === 'shake' ? { 
                    x: [-2, 2, -2, 2, 0],
                    rotate: [-2, 2, -2, 2, 0] 
                } : phase === 'reveal' ? { scale: 0, opacity: 0 } : {}}
                transition={{ duration: 0.4, repeat: 2 }}
            />

            {/* Flash Effect */}
            <m.div 
                className="reveal-chest-flash"
                initial={{ x: '-50%', y: '-50%', opacity: 0 }}
                animate={phase === 'flash' || phase === 'reveal' ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* Final Prize */}
            <m.img 
                src={diamondImg}
                className="reveal-chest-prize"
                initial={{ scale: 0, opacity: 0 }}
                animate={phase === 'reveal' ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 18,
                    delay: 0.1 
                }}
            />
        </div>
    </div>
  )
}
