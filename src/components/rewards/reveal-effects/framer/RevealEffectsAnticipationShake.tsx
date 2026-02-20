import { useEffect, useState } from 'react'
import * as m from 'motion/react-m'

/**
 *
 */
export function RevealEffectsAnticipationShake() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Delay animation start to ensure smooth mount transition
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Phase 1: ±2px, 10 shakes (100ms each = 1000ms)
  const phase1X = [0, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, 0]
  const phase1Y = [0, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0]
  const phase1Scale = Array(12).fill(1)

  // Phase 2: ±3.5px, 14 shakes (~70ms each ≈ 1000ms)
  const phase2X = [0, -3.5, 3.5, -3.5, 3.5, -3.5, 3.5, -3.5, 3.5, -3.5, 3.5, -3.5, 3.5, -3.5, 3.5, 0]
  const phase2Y = [0, 0.75, -0.75, 0.75, -0.75, 0.75, -0.75, 0.75, -0.75, 0.75, -0.75, 0.75, -0.75, 0.75, -0.75, 0]
  const phase2Scale = Array(16).fill(1.02)

  // Phase 3: ±5px, 20 shakes (50ms each = 1000ms)
  const phase3X = [0, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, 0]
  const phase3Y = [0, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 0]
  const phase3Scale = Array(22).fill(1.05)

  // Combine all phases into one continuous animation
  const allX = [...phase1X, ...phase2X, ...phase3X]
  const allY = [...phase1Y, ...phase2Y, ...phase3Y]
  const allScale = [...phase1Scale, ...phase2Scale, ...phase3Scale]

  return (
    <div
      className="anticipation-shake-container-framer"
      data-animation-id="reveal-effects__anticipation-shake"
    >
      <m.div
        className="anticipation-shake-box-framer"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={
          prefersReducedMotion
            ? {
                scale: [1, 1.03, 1],
              }
            : isAnimating
              ? {
                  x: allX,
                  y: allY,
                  scale: allScale,
                }
              : { x: 0, y: 0, scale: 1 }
        }
        transition={
          prefersReducedMotion
            ? {
                duration: 0.8,
                repeat: Infinity,
                ease: [0.4, 0.0, 0.2, 1],
              }
            : {
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }
        }
        style={{
          willChange: 'transform',
        }}
        aria-label="Mystery reward box building anticipation"
      >
        <div className="anticipation-shake-content-framer" aria-hidden="true">
          <div className="anticipation-shake-icon-framer">?</div>
        </div>
      </m.div>
    </div>
  )
}
