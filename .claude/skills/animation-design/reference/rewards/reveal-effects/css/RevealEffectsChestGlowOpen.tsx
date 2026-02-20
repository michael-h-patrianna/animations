import { useState, useEffect } from 'react'
import boxImg from '@/assets/present_box.png'
import diamondImg from '@/assets/Diamonds.png'
import './RevealEffectsChestGlowOpen.css'

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
    <div className="reveal-chest-glow-container-css">
        <div className="reveal-chest-glow-wrapper-css">
            {/* Aura Background (Only during reveal) */}
            <div className={`reveal-chest-glow-aura-css ${phase === 'reveal' ? 'active' : ''}`} />

            {/* Mystery Box */}
            <img 
                src={boxImg}
                className={`reveal-chest-box-css ${phase === 'shake' ? 'shaking' : ''} ${phase === 'reveal' ? 'hidden' : ''}`}
                alt="Mystery Box"
            />

            {/* Flash Effect */}
            <div className={`reveal-chest-flash-css ${phase === 'flash' || phase === 'reveal' ? 'active' : ''}`} />

            {/* Final Prize */}
            <img 
                src={diamondImg}
                className={`reveal-chest-prize-css ${phase === 'reveal' ? 'visible' : ''}`}
                alt="Prize"
            />
        </div>
    </div>
  )
}
