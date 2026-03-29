/**
 * Segmented Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsProgressSegmented.module.css + ../SharedTypes.ts
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsProgressSegmented.module.css'

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

  const prevActiveRef = useRef<Set<number>>(new Set<number>())
  const [glowIndex, setGlowIndex] = useState<number | null>(null)

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
    setGlowIndex(Math.max(...newlyActive))
  }, [activeSet])

  const handleGlowEnd = useCallback(() => {
    setGlowIndex(null)
  }, [])

  return (
    <div
      className={`${styles['pf-progress-segmented']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-segmented"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track']}>
          <div
            className={styles['pf-progress-fill']}
            style={{ transform: `scaleX(${displayProgress})` }}
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
              <div
                key={`segment-${i}`}
                className={isGlowing ? styles['pf-segment--glowing'] : undefined}
                onAnimationEnd={isGlowing ? handleGlowEnd : undefined}
                style={{
                  flex: 1,
                  position: 'relative',
                  borderRadius: isFirst ? '8px 2px 2px 8px' : isLast ? '2px 8px 8px 2px' : '2px',
                  border: `1px solid ${isActive ? 'var(--segmented-segment-border-active)' : 'var(--segmented-segment-border)'}`,
                  background: isActive ? 'var(--segmented-segment-bg)' : 'transparent',
                  overflow: 'hidden',
                }}
              >
                {isGlowing && <div className={styles['pf-segment__flash']} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
