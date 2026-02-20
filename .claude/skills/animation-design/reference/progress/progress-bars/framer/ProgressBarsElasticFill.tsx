import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import './ProgressBarsElasticFill.css'

export function ProgressBarsElasticFill() {
  const shouldReduceMotion = useReducedMotion()

  // Elastic fill animation: overshoot with squash, then settle
  const elasticAnimation = shouldReduceMotion
    ? {
        scaleX: 0.7,
        scaleY: 1,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
      }
    : {
        scaleX: [0, 0.77, 0.7],
        scaleY: [1, 0.9, 1],
        transition: {
          duration: 1.4, // 600ms overshoot + 800ms settle
          delay: 0.08, // 80ms anticipation delay
          ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
          times: [0, 0.43, 1], // 43% for overshoot (600ms / 1400ms)
        },
      }

  return (
    <div
      className="pf-progress-demo pf-progress-elastic-fill"
      data-animation-id="progress-bars__elastic-fill"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          <m.div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={70}
            aria-valuemin={0}
            aria-valuemax={100}
            initial={{ scaleX: 0, scaleY: 1 }}
            animate={elasticAnimation}
            style={{ transformOrigin: 'left center' }}
          />
        </div>
      </div>
    </div>
  )
}
