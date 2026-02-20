import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'

/**
 *
 */
export function ProgressBarsPulseWave() {
  const shouldReduceMotion = useReducedMotion()

  // Wave animation - continuous loop
  const getWaveAnimation = (delay: number) => {
    if (shouldReduceMotion) {
      return {}
    }
    return {
      x: ['0%', '100%', '200%'],
      scaleY: [0.8, 1.2, 0.8],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 2,
        delay,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    }
  }

  return (
    <div
      className="pf-progress-demo pf-progress-pulse-wave"
      data-animation-id="progress-bars__pulse-wave"
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
            {/* 4 wave overlays with staggered animations */}
            {[0, 0.5, 1, 1.5].map((delay, index) => (
              <m.div
                key={index}
                className="wave-overlay"
                initial={{ x: '0%', scaleY: 0.8, opacity: 0.3 }}
                animate={getWaveAnimation(delay)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
