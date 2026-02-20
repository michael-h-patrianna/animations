import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import './ProgressBarsShimmerSweep.css'

export function ProgressBarsShimmerSweep() {
  const shouldReduceMotion = useReducedMotion()

  // Shimmer sweep animation - continuous loop with pause
  const shimmerAnimation = shouldReduceMotion
    ? {}
    : {
        x: ['-100%', '100%', '200%', '200%'],
        skewX: [-15, -15, -15, -15],
        opacity: [0, 0.6, 0, 0],
        transition: {
          duration: 3.5,
          ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
          times: [0, 0.2, 0.714, 1],
          repeat: Infinity,
          repeatType: 'loop' as const,
        },
      }

  return (
    <div
      className="pf-progress-demo pf-progress-shimmer-sweep"
      data-animation-id="progress-bars__shimmer-sweep"
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
            {/* Shimmer overlay sweeping across progress bar */}
            <m.div
              className="shimmer-overlay"
              initial={{ x: '-100%', skewX: -15, opacity: 0 }}
              animate={shimmerAnimation}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
