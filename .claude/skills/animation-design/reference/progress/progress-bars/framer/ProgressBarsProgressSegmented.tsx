import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useEffect, useState } from 'react'
import './ProgressBarsProgressSegmented.css'

export function ProgressBarsProgressSegmented() {
const [activeSegments, setActiveSegments] = useState<number[]>([])
  const segmentCount = 4
  const segmentGap = 4
  const duration = 3

  useEffect(() => {
    // Trigger segment animations at specific thresholds
    const timers = [0, 1, 2, 3].map((index) => {
      const threshold = ((index + 1) / segmentCount) * duration * 1000
      return setTimeout(() => {
        setActiveSegments((prev) => [...prev, index])
      }, threshold)
    })

    return () => timers.forEach(clearTimeout)
  }, [])
  // Main fill animation
  const fillVariants = {
    initial: { scaleX: 0 },
    animate: {
      scaleX: [0, 0.25, 0.5, 0.75, 1],
      transition: {
        duration,
        times: [0, 0.25, 0.5, 0.75, 1],
        ease: 'linear' as const,
      },
    },
  }

  // Segment animation
  const segmentVariants = (isActive: boolean) => ({
    initial: { scale: 1, boxShadow: 'none' },
    animate: isActive
      ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            'none',
            '0 0 20px rgba(198,255,119,0.5)',
            'none',
          ],
          transition: {
            duration: 0.4,
            times: [0, 0.3, 1],
            ease: [0.68, -0.55, 0.265, 1.55] as const,
          },
        }
      : {},
  })

  // Segment glow animation
  const glowVariants = (isActive: boolean) => ({
    initial: { opacity: 0 },
    animate: isActive
      ? {
          opacity: [0, 1, 0],
          transition: {
            duration: 0.4,
            times: [0, 0.3, 1],
            ease: easeOut,
          },
        }
      : {},
  })

  return (
    <div
      className="pf-progress-demo pf-progress-segmented"
      data-animation-id="progress-bars__progress-segmented"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <m.div
            className="pf-progress-fill"
            style={{
              transformOrigin: 'left center',
              background: 'linear-gradient(90deg, #c6ff77 0%, #d4ff9f 100%)',
              borderRadius: '8px 0 0 8px',
              overflow: 'hidden',
            }}
            variants={fillVariants}
            initial="initial"
            animate="animate"
          />
        </div>

        {/* Gap overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {Array.from({ length: segmentCount - 1 }).map((_, i) => (
            <div
              key={`gap-${i}`}
              style={{
                position: 'absolute',
                width: segmentGap,
                top: 0,
                bottom: 0,
                left: `calc(${((i + 1) * 100) / segmentCount}% - ${segmentGap / 2}px)`,
                background: '#2a1040',
              }}
            />
          ))}
        </div>

        {/* Segment overlays for animations */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            gap: segmentGap,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          {Array.from({ length: segmentCount }).map((_, i) => {
            const isActive = activeSegments.includes(i)
            const isFirst = i === 0
            const isLast = i === segmentCount - 1

            return (
              <m.div
                key={`segment-${i}`}
                style={{
                  flex: 1,
                  position: 'relative',
                  borderRadius: isFirst
                    ? '8px 2px 2px 8px'
                    : isLast
                      ? '2px 8px 8px 2px'
                      : '2px',
                  border: '1px solid rgba(196,122,229,0.3)',
                  background: 'rgba(78,24,124,0.1)',
                  overflow: 'hidden',
                }}
                variants={segmentVariants(isActive)}
                initial="initial"
                animate="animate"
              >
                {/* Glow effect */}
                <m.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(198,255,119,0.3)',
                  }}
                  variants={glowVariants(isActive)}
                  initial="initial"
                  animate="animate"
                />
              </m.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
