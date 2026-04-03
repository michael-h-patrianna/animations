/**
 * Segmented Progress Bar
 *
 * Progress bar divided into segments with glow effects on segment completion.
 * When progress crosses a segment boundary, that segment pulses with a radiant
 * glow in the fill color — outer box-shadow, inner brightness flash, and subtle
 * scale pop.
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
 * Files to copy: this file + ProgressBarsProgressSegmented.module.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsProgressSegmented.module.css'

interface SegmentedProps extends ProgressBarProps {
  /** Number of segments. Default: 4. */
  segments?: number
}

const SEGMENT_GAP = 4
const GLOW_DURATION = 0.7

export function ProgressBarsProgressSegmented({
  progress,
  segments = 4,
  className,
  style,
}: SegmentedProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayProgress = progress ?? 0

  // Track which segments have been activated to detect new crossings
  const prevActiveRef = useRef<Set<number>>(new Set<number>())
  const [glowIndex, setGlowIndex] = useState<number | null>(null)
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeSet = useMemo(() => {
    const set = new Set<number>()
    for (let i = 0; i < segments; i++) {
      const threshold = (i + 1) / segments
      if (displayProgress >= threshold - 0.01) set.add(i)
    }
    return set
  }, [displayProgress, segments])

  useEffect(() => {
    const prev = prevActiveRef.current
    const newlyActive = [...activeSet].filter((i) => !prev.has(i))
    prevActiveRef.current = new Set(activeSet)

    if (newlyActive.length === 0) return

    // Glow only the frontmost (highest-index) newly-crossed segment
    const target = Math.max(...newlyActive)
    setGlowIndex(target)

    if (glowTimerRef.current) clearTimeout(glowTimerRef.current)
    glowTimerRef.current = setTimeout(() => {
      setGlowIndex(null)
    }, GLOW_DURATION * 1000)

    return () => {
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current)
    }
  }, [activeSet])

  return (
    <div
      className={`${styles['pf-progress-segmented-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-segmented"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track-fm']}>
          <m.div
            className={styles['pf-progress-fill-fm']}
            role="progressbar"
            aria-valuenow={Math.round(displayProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
              transformOrigin: 'left center',
              borderRadius: '8px 0 0 8px',
              overflow: 'hidden',
            }}
            initial={false}
            animate={{ scaleX: displayProgress }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.15, ease: 'linear' }}
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
            const isGlowing = glowIndex === i
            return (
              <m.div
                key={`segment-${i}`}
                style={{
                  flex: 1,
                  position: 'relative',
                  borderRadius: isFirst ? '8px 2px 2px 8px' : isLast ? '2px 8px 8px 2px' : '2px',
                  border: `1px solid ${isActive ? 'var(--segmented-segment-border-active)' : 'var(--segmented-segment-border)'}`,
                  background: isActive ? 'var(--segmented-segment-bg)' : 'transparent',
                  overflow: 'hidden',
                }}
                animate={
                  prefersReducedMotion
                    ? { scale: 1, boxShadow: '0 0 0px 0px var(--segmented-fill-glow-off)' }
                    : isGlowing
                      ? {
                          scale: [1, 1.08, 1],
                          boxShadow: [
                            '0 0 0px 0px var(--segmented-fill-glow-off)',
                            '0 0 24px 8px var(--segmented-fill-glow-on)',
                            '0 0 0px 0px var(--segmented-fill-glow-off)',
                          ],
                          transition: {
                            duration: GLOW_DURATION,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                      : {
                          scale: 1,
                          boxShadow: '0 0 0px 0px var(--segmented-fill-glow-off)',
                        }
                }
              >
                {/* Inner brightness flash on glow — disabled in reduced motion */}
                {isGlowing && !prefersReducedMotion && (
                  <m.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      background:
                        'linear-gradient(180deg, var(--segmented-fill-from, #a78bfa) 0%, var(--segmented-fill-to, #c4b5fd) 100%)',
                      pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.55, 0] }}
                    transition={{
                      duration: GLOW_DURATION,
                      times: [0, 0.25, 1],
                      ease: [0.22, 1, 0.36, 1],
                    }}
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
