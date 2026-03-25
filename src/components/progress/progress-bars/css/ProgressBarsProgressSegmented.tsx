/**
 * Segmented Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsProgressSegmented.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import './ProgressBarsProgressSegmented.css'

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

  return (
    <div
      className={`pf-progress-segmented${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-segmented"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <div className="pf-progress-fill" style={{ transform: `scaleX(${displayProgress})` }} />
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
            const isFirst = i === 0
            const isLast = i === segments - 1
            return (
              <div
                key={`segment-${i}`}
                style={{
                  flex: 1,
                  position: 'relative',
                  borderRadius: isFirst ? '8px 2px 2px 8px' : isLast ? '2px 8px 8px 2px' : '2px',
                  border: '1px solid var(--segmented-segment-border)',
                  background: 'var(--segmented-segment-bg)',
                  overflow: 'hidden',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
