import * as m from 'motion/react-m'
import './CollectionEffectsCoinCollectPath.css'

export function CollectionEffectsCoinCollectPath() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      className="coin-collect-path-container-framer"
      data-animation-id="collection-effects__coin-collect-path"
    >
      <div className="coin-collect-path-stage-framer">
        {/* Destination indicator */}
        <div className="coin-collect-path-destination-framer" aria-hidden="true">
          <div className="coin-collect-path-destination__inner">Balance</div>
        </div>

        {/* Flying coin */}
        <m.div
          className="coin-collect-path-coin-framer"
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
          }}
          animate={
            prefersReducedMotion
              ? {
                  x: 230,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  opacity: [1, 1, 0],
                }
              : {
                  x: [0, 60, 140, 230],
                  y: [0, -30, -70, -110],
                  scale: [1.0, 0.9, 0.7, 0.3],
                  rotate: [0, 360],
                  opacity: [1, 1, 0],
                }
          }
          transition={
            prefersReducedMotion
              ? {
                  duration: 0.4,
                  ease: 'easeOut',
                  opacity: {
                    duration: 0.4,
                    times: [0, 0.5, 1],
                    ease: 'linear',
                  },
                }
              : {
                  duration: 0.7,
                  times: [0, 0.23, 0.51, 1.0],
                  ease: [0.25, 0.1, 0.25, 1],
                  rotate: {
                    duration: 0.7,
                    ease: 'linear',
                  },
                  opacity: {
                    duration: 0.7,
                    times: [0, 0.9, 1.0],
                    ease: 'linear',
                  },
                }
          }
          aria-label="Coin collected"
        >
          <div className="coin-collect-path-coin__inner">🪙</div>
        </m.div>
      </div>
    </div>
  )
}
