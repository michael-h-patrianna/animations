/**
 * Liquid Tube Progress Bar
 *
 * Vertical tube that fills with animated liquid, surface waves, and rising
 * bubbles. In demo mode cycles continuously. In controlled mode the liquid
 * level reflects the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsLiquidTube progress={0.6} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--liquid-tube-border`  — tube border color
 * - `--liquid-tube-bg`      — tube background
 * - `--pf-liquid-tube-fm__fill`    — liquid color
 * - `--liquid-tube-bubble`  — bubble color
 *
 * Files to copy: this file + ProgressBarsLiquidTube.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsLiquidTube.module.css'

export function ProgressBarsLiquidTube({ progress, className, style }: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayProgress = progress ?? 0
  const percent = displayProgress * 100

  return (
    <div
      className={`${styles['pf-liquid-tube-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__liquid-tube"
    >
      <div className={styles['pf-liquid-tube-fm__glass']}>
        <m.div
          className={styles['pf-liquid-tube-fm__fill']}
          animate={{ y: `${100 - percent}%` }}
          transition={
            prefersReducedMotion ? { duration: 0.1 } : { type: 'spring', bounce: 0, duration: 0.5 }
          }
          style={{ height: '100%' }}
        >
          <div className={styles['pf-liquid-tube-fm__surface']}>
            <m.div
              className={styles['pf-liquid-tube-fm__wave']}
              animate={prefersReducedMotion ? undefined : { x: ['-50%', '0%'] }}
              transition={
                prefersReducedMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'linear' }
              }
            />
          </div>
          {!prefersReducedMotion &&
            [1, 2, 3].map((i) => (
              <m.div
                key={i}
                className={styles['pf-liquid-tube-fm__bubble']}
                style={{ left: `${20 + i * 20}%` }}
                animate={{ y: [0, -100], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeIn',
                }}
              />
            ))}
        </m.div>
      </div>
    </div>
  )
}
