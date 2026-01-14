import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'
import diamondImg from '@/assets/Diamonds.png'
import './RevealEffectsCardFlipSmooth.css'

export function RevealEffectsCardFlipSmooth() {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    // Trigger flip animation after mount
    const flipTimer = setTimeout(() => {
      setIsFlipped(true)
    }, 600)

    return () => clearTimeout(flipTimer)
  }, [])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      className="card-flip-container-framer"
      data-animation-id="reveal-effects__card-flip-smooth"
    >
      <m.div
        className="card-flip-card-framer"
        initial={{ rotateY: 0, scale: 1 }}
        animate={
          prefersReducedMotion
            ? {
                rotateY: 0,
                scale: 1,
              }
            : isFlipped
              ? {
                  rotateY: [0, 0, 90, 180],
                  scale: [1, 0.98, 1.1, 1],
                }
              : { rotateY: 0, scale: 1 }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : {
                times: [0, 0.2, 0.6, 1],
                duration: 0.8,
                delay: isFlipped ? 0 : 0,
                ease: "easeInOut",
              }
        }
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front face - Mystery */}
        <m.div
          className="card-flip-face-framer card-flip-face--front-framer"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="card-flip-pattern" />
          <div className="card-flip-content">
            <div className="card-flip-mystery-mark">?</div>
          </div>
          {/* Holographic Shine */}
          <m.div 
            className="card-flip-shine"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </m.div>

        {/* Back face - Revealed */}
        <m.div
          className="card-flip-face-framer card-flip-face--back-framer"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="card-flip-content">
            <img src={diamondImg} alt="Reward" className="card-flip-reward-img" />
            <div className="card-flip-reward-text">100</div>
            <div className="card-flip-reward-label">Gems</div>
          </div>
        </m.div>
      </m.div>
    </div>
  )
}
