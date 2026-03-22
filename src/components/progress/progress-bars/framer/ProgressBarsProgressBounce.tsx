/**
 * Bounce Fill Progress Bar
 *
 * Progress bar with playful bounce physics — the fill overshoots, squashes,
 * and settles with impact waves and celebration particles on completion.
 * In demo mode plays a one-shot fill to 100%. In controlled mode transitions
 * to the given progress with spring physics.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressBounce progress={0.8} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--bounce-track-color`  — track background
 * - `--bounce-fill-from`    — fill gradient start
 * - `--bounce-fill-to`      — fill gradient end
 * - `--bounce-accent`       — accent for waves/particles
 * - `--bounce-height`       — track height (default: 12px)
 *
 * Files to copy: this file + ProgressBarsProgressBounce.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useEffect, useState } from 'react'
import type { ProgressBarProps } from '../SharedTypes'

export function ProgressBarsProgressBounce({
  progress,
  className,
  style,
}: ProgressBarProps) {
  const isDemo = progress === undefined
  const target = progress ?? 1
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    if (!isDemo) return
    const timer = setTimeout(() => setShowParticles(true), 1600)
    return () => clearTimeout(timer)
  }, [isDemo])

  const fillVariants = {
    initial: { scaleX: 0, scaleY: 1 },
    animate: {
      scaleX: [0, 0.7, 0.7, 1.15, 0.92, 1.06, 0.97, 1.01, 1],
      scaleY: [1, 1, 0.8, 0.85, 1.08, 0.96, 1.02, 0.99, 1],
      transition: {
        duration: 1.6,
        times: [0, 0.5, 0.55, 0.7, 0.78, 0.86, 0.92, 0.96, 1],
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
  }

  const trackVariants = {
    initial: { scaleY: 1 },
    animate: {
      scaleY: [1, 1, 1.2, 0.9, 1.1, 0.95, 1],
      transition: {
        duration: 1.6,
        times: [0, 0.55, 0.7, 0.78, 0.86, 0.92, 1],
        ease: easeOut,
      },
    },
  }

  const waveVariants = (delay: number) => ({
    initial: { x: 0, scaleX: 1, opacity: 0 },
    animate: {
      x: [-10, -30],
      scaleX: [2, 0.5],
      opacity: [0, 1, 0],
      transition: {
        duration: 0.4,
        times: [0, 0.2, 1],
        delay: 1.6 * 0.7 + delay,
        ease: easeOut,
      },
    },
  })

  const elasticOverlayVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0, 1, 0],
      transition: { duration: 1.6, times: [0, 0.68, 0.72, 0.85], ease: easeOut },
    },
  }

  const particleVariants = (angle: number, distance: number) => ({
    initial: { scale: 0, opacity: 1, x: 0, y: 0 },
    animate: {
      scale: [0, 1, 0],
      opacity: [1, 1, 0],
      x: [0, Math.cos(angle) * distance, Math.cos(angle) * distance * 1.5],
      y: [0, Math.sin(angle) * distance, Math.sin(angle) * distance * 1.5],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
        ease: [0.4, 0, 0.6, 1] as const,
      },
    },
  })

  return (
    <div
      className={`pf-progress-bounce${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-bounce"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        {isDemo ? (
          <>
            <m.div
              className="pf-progress-track"
              variants={trackVariants}
              initial="initial"
              animate="animate"
            >
              <m.div
                className="pf-progress-fill"
                style={{ transformOrigin: 'left center', position: 'relative', animation: 'none' }}
                variants={fillVariants}
                initial="initial"
                animate="animate"
              >
                <m.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(ellipse at right center, var(--bounce-accent, var(--pf-anim-green-30)) 0%, transparent 50%)',
                    pointerEvents: 'none',
                  }}
                  variants={elasticOverlayVariants}
                  initial="initial"
                  animate="animate"
                />
              </m.div>
            </m.div>

            {[0, 1, 2].map((i) => (
              <m.div
                key={`wave-${i}`}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  y: '-50%',
                  width: 4,
                  height: '100%',
                  background: `var(--bounce-accent, var(--pf-anim-green-${60 - i * 20}))`,
                  pointerEvents: 'none',
                  opacity: 0,
                }}
                variants={waveVariants(i * 0.05)}
                initial="initial"
                animate="animate"
              />
            ))}

            {showParticles &&
              Array.from({ length: 5 }).map((_, i) => {
                const angle = (i / 5) * Math.PI * 2
                const distance = 30 + Math.random() * 20
                return (
                  <m.div
                    key={`particle-${i}`}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      width: 4,
                      height: 4,
                      background:
                        i % 2 === 0
                          ? 'var(--bounce-accent, var(--pf-anim-green))'
                          : 'var(--bounce-accent, var(--pf-anim-green-dark))',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                    variants={particleVariants(angle, distance)}
                    initial="initial"
                    animate="animate"
                  />
                )
              })}
          </>
        ) : (
          <div className="pf-progress-track">
            <m.div
              className="pf-progress-fill"
              animate={{ scaleX: target }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              style={{ transformOrigin: 'left center', animation: 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
