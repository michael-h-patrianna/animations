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
 * - `--liquid-tube-fill`    — liquid color
 * - `--liquid-tube-bubble`  — bubble color
 *
 * Files to copy: this file + ProgressBarsLiquidTube.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

export function ProgressBarsLiquidTube({ progress, className, style }: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayProgress = progress ?? 0
  const percent = displayProgress * 100

  return (
    <div
      className={`liquid-tube-container${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__liquid-tube"
    >
      <div className="liquid-tube-glass">
        <m.div
          className="liquid-tube-fill"
          animate={{ y: `${100 - percent}%` }}
          transition={
            prefersReducedMotion ? { duration: 0.1 } : { type: 'spring', bounce: 0, duration: 0.5 }
          }
          style={{ height: '100%', animation: 'none' }}
        >
          <div className="liquid-tube-surface">
            <m.div
              className="liquid-wave"
              animate={prefersReducedMotion ? undefined : { x: ['-50%', '0%'] }}
              transition={
                prefersReducedMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'linear' }
              }
              style={{ animation: 'none' }}
            />
          </div>
          {!prefersReducedMotion &&
            [1, 2, 3].map((i) => (
              <m.div
                key={i}
                className="liquid-bubble"
                style={{ left: `${20 + i * 20}%`, animation: 'none' }}
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
