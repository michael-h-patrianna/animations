/**
 * Segmented Progress Bar
 *
 * Progress bar divided into segments with glow effects on segment completion.
 * In demo mode plays a one-shot fill from 0 to 100%. In controlled mode
 * fills proportional to the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressSegmented progress={0.5} segments={4} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--segmented-track-color`    — track background
 * - `--segmented-fill-from`      — fill gradient start
 * - `--segmented-fill-to`        — fill gradient end
 * - `--segmented-segment-bg`     — segment overlay background
 * - `--segmented-segment-border` — segment border color
 * - `--segmented-gap-color`      — gap divider color
 * - `--segmented-height`         — track height (default: 12px)
 *
 * Files to copy: this file + ProgressBarsProgressSegmented.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

interface SegmentedProps extends ProgressBarProps {
  /** Number of segments. Default: 4. */
  segments?: number
}

const SEGMENT_GAP = 4

export function ProgressBarsProgressSegmented({
  progress,
  segments = 4,
  className,
  style,
}: SegmentedProps) {
  const displayProgress = progress ?? 0

  const fillVariants = {
    initial: { scaleX: 0 },
    animate: {
      scaleX: displayProgress,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  return (
    <div
      className={`pf-progress-segmented${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-segmented"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <m.div
            className="pf-progress-fill"
            style={{
              transformOrigin: 'left center',
              borderRadius: '8px 0 0 8px',
              overflow: 'hidden',
              animation: 'none',
            }}
            variants={fillVariants}
            initial="initial"
            animate="animate"
          />
        </div>

        {/* Gap dividers */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
          {Array.from({ length: segments - 1 }, (_, i) => (
            <div
              key={`gap-${i}`}
              style={{
                position: 'absolute',
                width: SEGMENT_GAP,
                top: 0,
                bottom: 0,
                left: `${((i + 1) * 100) / segments}%`,
                marginLeft: -(SEGMENT_GAP / 2),
                background: 'var(--segmented-gap-color)',
              }}
            />
          ))}
        </div>

        {/* Segment overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            gap: SEGMENT_GAP,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          {Array.from({ length: segments }, (_, i) => {
            const segmentThreshold = (i + 1) / segments
            const isActive = displayProgress >= segmentThreshold - 0.01
            const isFirst = i === 0
            const isLast = i === segments - 1
            return (
              <m.div
                key={`segment-${i}`}
                style={{
                  flex: 1,
                  position: 'relative',
                  borderRadius: isFirst ? '8px 2px 2px 8px' : isLast ? '2px 8px 8px 2px' : '2px',
                  border: '1px solid var(--segmented-segment-border)',
                  background: 'var(--segmented-segment-bg)',
                  overflow: 'hidden',
                }}
                animate={
                  isActive
                    ? {
                        scale: [1, 1.1, 1],
                        transition: {
                          duration: 0.4,
                          times: [0, 0.3, 1],
                          ease: [0.68, -0.55, 0.265, 1.55] as const,
                        },
                      }
                    : {}
                }
              >
                {isActive && (
                  <m.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--segmented-fill-from)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.4, times: [0, 0.3, 1], ease: easeOut }}
                  />
                )}
              </m.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
