import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'
import './RevealEffectsCardFlipSmooth.css'

export function RevealEffectsCardFlipSmooth() {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    // Trigger flip animation after mount
    const flipTimer = setTimeout(() => {
      setIsFlipped(true)
    }, 100)

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
                  scale: [1, 0.98, 1.05, 1],
                }
              : { rotateY: 0, scale: 1 }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : {
                times: [0, 0.118, 0.5, 1],
                duration: 0.68,
                delay: isFlipped ? 0 : 0,
                ease: [0.45, 0.05, 0.55, 0.95] as const,
                scale: {
                  ease: [0.45, 0.05, 0.55, 0.95],
                },
                rotateY: {
                  ease: [0.45, 0.05, 0.55, 0.95],
                },
              }
        }
        style={{
          transformStyle: 'preserve-3d',
        }}
        aria-label={isFlipped ? 'Reward revealed: 100 coins' : 'Mystery reward card'}
      >
        {/* Front face - Mystery */}
        <m.div
          className="card-flip-face-framer card-flip-face--front-framer"
          animate={
            prefersReducedMotion
              ? { opacity: isFlipped ? 0 : 1 }
              : { opacity: isFlipped ? 0 : 1 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.2, delay: isFlipped ? 0 : 0 }
              : {
                  duration: 0.05,
                  delay: isFlipped ? 0.34 : 0, // Fade at mid-flip (340ms)
                }
          }
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="card-flip-content">
            <div className="card-flip-mystery-icon">?</div>
            <div className="card-flip-mystery-text">Mystery</div>
          </div>
        </m.div>

        {/* Back face - Revealed */}
        <m.div
          className="card-flip-face-framer card-flip-face--back-framer"
          initial={{ rotateY: 180 }}
          animate={
            prefersReducedMotion
              ? { opacity: isFlipped ? 1 : 0, rotateY: 180 }
              : { opacity: isFlipped ? 1 : 0, rotateY: 180 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.2, delay: isFlipped ? 0.1 : 0 }
              : {
                  opacity: {
                    duration: 0.05,
                    delay: isFlipped ? 0.34 : 0, // Fade in at mid-flip (340ms)
                  },
                  rotateY: {
                    duration: 0,
                  },
                }
          }
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="card-flip-content">
            <div className="card-flip-reward-icon">$</div>
            <div className="card-flip-reward-text">100</div>
            <div className="card-flip-reward-label">Coins</div>
          </div>
        </m.div>
      </m.div>
    </div>
  )
}
