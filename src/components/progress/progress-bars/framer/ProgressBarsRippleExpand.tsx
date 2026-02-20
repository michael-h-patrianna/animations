import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'

/**
 *
 */
export function ProgressBarsRippleExpand() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      className="pf-progress-demo pf-progress-ripple-expand"
      data-animation-id="progress-bars__ripple-expand"
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
            {/* Ripple rings - staggered expansion with Framer Motion */}
            {!shouldReduceMotion && (
              <>
                <m.div
                  className="pf-ripple pf-ripple-1"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{
                    scale: 2.5,
                    opacity: 0,
                    transition: {
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                    },
                  }}
                  aria-hidden="true"
                />
                <m.div
                  className="pf-ripple pf-ripple-2"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: 2.5,
                    opacity: 0,
                    transition: {
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                      delay: 0.3,
                    },
                  }}
                  aria-hidden="true"
                />
                <m.div
                  className="pf-ripple pf-ripple-3"
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{
                    scale: 2.5,
                    opacity: 0,
                    transition: {
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                      delay: 0.6,
                    },
                  }}
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
