/**
 * Sci-Fi Loader Progress Bar
 *
 * Futuristic system-init style progress bar with glint sweep and decorative
 * framing. In demo mode cycles continuously. In controlled mode displays
 * the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsSciFiLoader progress={0.75} label="DOWNLOADING:" />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--scifi-bg`      — container background
 * - `--scifi-track`   — track background
 * - `--scifi-fill`    — fill color
 * - `--scifi-glint`   — glint sweep color
 * - `--scifi-text`    — label text color
 * - `--scifi-decor`   — decorative frame color
 *
 * Files to copy: this file + ProgressBarsSciFiLoader.module.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsSciFiLoader.module.css'

interface SciFiLoaderProps extends ProgressBarProps {
  /** Label prefix text. Default: "SYSTEM.INIT:". */
  label?: string
}

export function ProgressBarsSciFiLoader({
  progress,
  label = 'SYSTEM.INIT:',
  className,
  style,
}: SciFiLoaderProps) {
  const prefersReducedMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(300)
  useLayoutEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth)
  }, [])
  const displayProgress = progress ?? 0
  const percent = Math.round(displayProgress * 100)

  return (
    <div
      className={`${styles['pf-scifi-loader-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__sci-fi-loader"
    >
      <div ref={trackRef} className={styles['pf-scifi-loader-fm__track']}>
        <m.div
          className={styles['pf-scifi-loader-fm__fill']}
          initial={false}
          animate={{ scaleX: displayProgress }}
          transition={{
            type: 'tween',
            ease: 'linear',
            duration: prefersReducedMotion ? 0.05 : 0.05,
          }}
          style={{ transformOrigin: 'left center' }}
        />
        {!prefersReducedMotion && (
          <m.div
            className={styles['pf-scifi-loader-fm__glint']}
            animate={{ x: [-40, trackWidth + 40] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ left: 0 }}
          />
        )}
      </div>
      <div className={styles['pf-scifi-loader-fm__decor-top']} />
      <div className={styles['pf-scifi-loader-fm__decor-bottom']} />
      <div className={styles['pf-scifi-loader-fm__text']}>
        {label} {percent}%
      </div>
    </div>
  )
}
