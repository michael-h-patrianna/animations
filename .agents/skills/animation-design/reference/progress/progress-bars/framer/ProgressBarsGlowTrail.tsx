import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import './ProgressBarsGlowTrail.css'

export function ProgressBarsGlowTrail() {
  const shouldReduceMotion = useReducedMotion()

  // Glow pulse animation: opacity 0.4 → 0.8 → 0.4
  const glowAnimation = shouldReduceMotion
    ? {
        opacity: 0.6,
      }
    : {
        opacity: [0.4, 0.8, 0.4],
        transition: {
          duration: 1.5,
          ease: 'easeInOut' as const,
          repeat: Infinity,
        },
      }

  return (
    <div
      className="pf-progress-demo pf-progress-glow-trail"
      data-animation-id="progress-bars__glow-trail"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          <div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={70}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <m.div
              className="pf-glow-overlay"
              initial={{ opacity: 0.4 }}
              animate={glowAnimation}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
