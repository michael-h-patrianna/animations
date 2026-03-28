/**
 * Thin Progress Line
 *
 * Ultra-thin progress line with photon trail, pulse dots, halo glow,
 * and completion flash. When no `progress` prop is given, plays a
 * one-shot demo sweep. Pass `progress` (0-1) for controlled mode.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressThin progress={0.6} label="XP" />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--thin-label-color`, `--thin-track-bg`
 * - `--thin-fill-from`, `--thin-fill-via`, `--thin-fill-to`
 * - `--thin-fill-glow`, `--thin-accent`, `--thin-accent-dim`, `--thin-accent-faint`
 *
 * Files to copy: this file + ProgressBarsProgressThin.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsProgressThin.module.css'

interface ProgressThinProps extends ProgressBarProps {
  /** Label text above the bar. Default: "Level progress". */
  label?: string
}

const SWEEP_S = 1.2
const SWEEP_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

export function ProgressBarsProgressThin({
  progress,
  label = 'Level progress',
  className,
  style,
}: ProgressThinProps) {
  const isControlled = progress !== undefined
  const prefersReduced = useReducedMotion()
  const showEffects = !isControlled && !prefersReduced
  const trackContainerRef = useRef<HTMLDivElement>(null)
  const [trackW, setTrackW] = useState(300)
  useLayoutEffect(() => {
    if (trackContainerRef.current) setTrackW(trackContainerRef.current.offsetWidth)
  }, [])

  return (
    <div
      className={`${styles['pf-progress-thin-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-thin"
    >
      {label !== undefined && label !== '' && (
        <div className={styles['pf-progress-thin-fm__label']}>{label}</div>
      )}

      <div ref={trackContainerRef} className="track-container" style={{ position: 'relative' }}>
        {/* Halo glow (demo only) */}
        {showEffects && (
          <m.div
            className={styles['pf-progress-thin-fm__halo']}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.5, 0.3, 0] }}
            transition={{
              duration: SWEEP_S,
              ease: 'easeOut',
              times: [0, 0.3, 0.6, 0.9, 1],
            }}
            style={{ scale: 1.3 }}
          />
        )}

        <div className={styles['pf-progress-track-fm']}>
          <m.div
            className={styles['pf-progress-fill-fm']}
            role="progressbar"
            aria-valuenow={Math.round((progress ?? 1) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            initial={isControlled ? { scaleX: 0 } : { scaleX: 0, opacity: 0.3 }}
            animate={
              isControlled ? { scaleX: progress } : { scaleX: 1, opacity: [0.3, 0.6, 0.8, 1] }
            }
            transition={
              isControlled
                ? { duration: 0.5, ease: SWEEP_EASE }
                : {
                    scaleX: { duration: SWEEP_S, ease: SWEEP_EASE },
                    opacity: { duration: SWEEP_S, times: [0, 0.3, 0.7, 1] },
                  }
            }
          />
        </div>

        {/* Photon trail (demo only) */}
        {showEffects && (
          <m.div
            className={styles['pf-progress-thin-fm__photon']}
            initial={{ x: trackW * -0.05, opacity: 0 }}
            animate={{ x: trackW, opacity: [0, 0.8, 0.6, 0] }}
            transition={{
              x: { duration: SWEEP_S, ease: SWEEP_EASE },
              opacity: { duration: SWEEP_S, times: [0, 0.15, 0.85, 1] },
            }}
            style={{ left: 0, y: '-50%' }}
          />
        )}

        {/* Pulse dots (demo only) */}
        {showEffects &&
          [0, 1, 2].map((i) => (
            <m.div
              key={i}
              className={styles['pf-progress-thin-fm__dot']}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
                delay: 0.36 + i * 0.1,
                times: [0, 0.3, 1],
              }}
              style={{
                left: `${30 + i * 25}%`,
                x: '-50%',
                y: '-50%',
              }}
            />
          ))}

        {/* Completion flash (demo only) */}
        {showEffects && (
          <m.div
            className={styles['pf-progress-thin-fm__flash']}
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0.8, 1, 1] }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
              delay: SWEEP_S,
              times: [0, 0.3, 1],
            }}
          />
        )}
      </div>
    </div>
  )
}
