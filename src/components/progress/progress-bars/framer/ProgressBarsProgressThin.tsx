/**
 * Thin Progress Line
 *
 * Ultra-thin progress line with photon trail, pulse dots, halo glow, and
 * completion flash effects. In demo mode plays a one-shot sweep animation.
 * In controlled mode the fill transitions to the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressThin progress={0.6} label="XP" />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--thin-label-color`   — label text color (default: rgb(255 255 255 / 55%))
 * - `--thin-track-bg`      — track background (default: rgb(255 255 255 / 6%))
 * - `--thin-fill-from`     — fill gradient start (default: #38bdf8)
 * - `--thin-fill-via`      — fill gradient middle (default: #7dd3fc)
 * - `--thin-fill-to`       — fill gradient end (default: #bae6fd)
 * - `--thin-fill-glow`     — fill glow shadow (default: rgb(56 189 248 / 40%))
 * - `--thin-accent`        — accent for photon/dots/halo (default: #38bdf8)
 *
 * Files to copy: this file + ProgressBarsProgressThin.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import type { ProgressBarProps } from '../SharedTypes'

interface ProgressThinProps extends ProgressBarProps {
  /** Label text above the bar. Default: "Level progress". */
  label?: string
}

const DEMO_DURATION = 1.2

export function ProgressBarsProgressThin({
  progress,
  label = 'Level progress',
  className,
  style,
}: ProgressThinProps) {
  const isDemo = progress === undefined
  const target = progress ?? 1

  const fillVariants = {
    hidden: { scaleX: 0, opacity: 0.3 },
    visible: {
      scaleX: [0, 0.3, 0.7, 1],
      opacity: [0.3, 0.6, 0.8, 1],
      transition: {
        duration: DEMO_DURATION,
        times: [0, 0.3, 0.7, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const photonVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: [0, 0, 1, 0.5, 0],
      x: [20, 20, 0, -10, -20],
      transition: {
        duration: DEMO_DURATION,
        times: [0, 0.2, 0.5, 0.9, 1],
        ease: easeOut,
      },
    },
  }

  const haloVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0, 0.5, 0.3, 0],
      transition: {
        duration: DEMO_DURATION,
        times: [0, 0.3, 0.6, 0.9, 1],
        ease: easeOut,
      },
    },
  }

  const dotVariants = (delay: number) => ({
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      transition: {
        duration: 0.4,
        times: [0, 0.3, 1],
        delay: DEMO_DURATION * 0.3 + delay,
        ease: easeOut,
      },
    },
  })

  const flashVariants = {
    hidden: { opacity: 0, scaleX: 0.8 },
    visible: {
      opacity: [0, 1, 0],
      scaleX: [0.8, 1, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.3, 1],
        delay: DEMO_DURATION,
        ease: easeOut,
      },
    },
  }

  return (
    <div
      className={`pf-progress-thin${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-thin"
    >
      {label !== undefined && label !== '' && (
        <div className="pf-progress-thin__label">{label}</div>
      )}

      {isDemo ? (
        <m.div
          className="track-container"
          style={{ position: 'relative' }}
          initial="hidden"
          animate="visible"
        >
          <m.div
            variants={haloVariants}
            style={{
              position: 'absolute',
              inset: '-8px',
              background:
                'radial-gradient(ellipse at right center, var(--thin-accent-faint) 0%, transparent 70%)',
              pointerEvents: 'none',
              transform: 'scale(1.3)',
            }}
          />

          <div className="pf-progress-track" style={{ height: '2px' }}>
            <m.div
              className="pf-progress-fill"
              variants={fillVariants}
              style={{
                transformOrigin: 'left center',
                position: 'relative',
                overflow: 'visible',
                animation: 'none',
              }}
            >
              <m.div
                variants={photonVariants}
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '60px',
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent 0%, var(--thin-accent-dim) 50%, var(--thin-accent) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </m.div>
          </div>

          {[0, 1, 2].map((i) => (
            <m.div
              key={i}
              variants={dotVariants(i * 0.1)}
              style={{
                position: 'absolute',
                left: `${30 + i * 25}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '4px',
                height: '4px',
                background: 'var(--thin-accent, #38bdf8)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          ))}

          <m.div
            variants={flashVariants}
            style={{
              position: 'absolute',
              inset: '-4px',
              background: 'linear-gradient(90deg, transparent 0%, var(--thin-flash) 100%)',
              pointerEvents: 'none',
            }}
          />
        </m.div>
      ) : (
        <div className="track-container" style={{ position: 'relative' }}>
          <div className="pf-progress-track" style={{ height: '2px' }}>
            <m.div
              className="pf-progress-fill"
              animate={{ scaleX: target }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                transformOrigin: 'left center',
                position: 'relative',
                overflow: 'visible',
                animation: 'none',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
