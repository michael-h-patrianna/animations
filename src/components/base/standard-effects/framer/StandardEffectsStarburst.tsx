/**
 * Starburst / Radial Rays — rotating ray background meant to sit behind content.
 * Port to React Native: SVG wedges via react-native-svg in a static container,
 * rotation via Reanimated withTiming on a wrapper MotiView.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsStarburst rayCount={12} size={200}><YourIcon /></StandardEffectsStarburst>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useId, useMemo, type ReactNode } from 'react'
import { STARBURST_RAY_COLOR } from '@/components/base/standard-effects/SharedDefaults'
import { isLinearGradient, type ColorOrGradient } from '@/types/gradient'

interface StandardEffectsStarburstProps {
  /** Color of the ray wedges — solid CSS color or linear gradient. */
  rayColor?: ColorOrGradient
  /** Number of ray wedges (even numbers work best). Default: 12 */
  rayCount?: number
  /** Fraction of each slice the colored ray occupies (0–1). Default: 0.5 */
  rayWidth?: number
  /** Time for one full revolution in ms. Default: 10000 */
  rotationSpeed?: number
  /** Diameter of the ray disc in px. Default: 200 */
  size?: number
  /** Content rendered on top of rays. */
  children?: ReactNode
}

function buildWedgePath(index: number, total: number, radius: number, widthRatio: number): string {
  const sliceAngle = (2 * Math.PI) / total
  const startAngle = index * sliceAngle
  const endAngle = startAngle + sliceAngle * widthRatio
  const cx = radius
  const cy = radius
  const x1 = cx + radius * Math.cos(startAngle)
  const y1 = cy + radius * Math.sin(startAngle)
  const x2 = cx + radius * Math.cos(endAngle)
  const y2 = cy + radius * Math.sin(endAngle)
  const largeArc = widthRatio > 0.5 ? 1 : 0
  return `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`
}

function StandardEffectsStarburstComponent({
  rayColor = STARBURST_RAY_COLOR,
  rayCount = 12,
  rayWidth = 0.5,
  rotationSpeed = 10000,
  size = 200,
  children,
}: StandardEffectsStarburstProps) {
  const prefersReducedMotion = useReducedMotion()
  const radius = size / 2
  const rotationDurationS = rotationSpeed / 1000
  const gradientId = useId()

  const wedgePaths = useMemo(() => {
    const clampedCount = Math.max(4, Math.min(24, rayCount))
    const clampedWidth = Math.max(0.05, Math.min(0.95, rayWidth))
    return Array.from({ length: clampedCount }, (_, i) =>
      buildWedgePath(i, clampedCount, radius, clampedWidth)
    )
  }, [rayCount, rayWidth, radius])

  const isGradient = isLinearGradient(rayColor)

  // Per-ray gradients: each wedge gets its own linearGradient running from
  // center → outer edge along the wedge's radial midline.
  const rayGradients = useMemo(() => {
    if (!isGradient) return null
    const clampedCount = Math.max(4, Math.min(24, rayCount))
    const clampedWidth = Math.max(0.05, Math.min(0.95, rayWidth))
    const sliceAngle = (2 * Math.PI) / clampedCount
    return Array.from({ length: clampedCount }, (_, i) => {
      const midAngle = i * sliceAngle + (sliceAngle * clampedWidth) / 2
      return {
        x1: radius,
        y1: radius,
        x2: radius + radius * Math.cos(midAngle),
        y2: radius + radius * Math.sin(midAngle),
      }
    })
  }, [isGradient, rayCount, rayWidth, radius])

  return (
    <div
      data-animation-id="standard-effects__starburst"
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '50%',
      }}
      role="img"
      aria-label="Starburst radial rays"
    >
      {/* Rotating ray disc — static SVG inside a Motion-rotated wrapper */}
      <m.div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}
        initial={{ opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 0.4 } : { opacity: 0.6, rotate: 360 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.3, ease: 'easeOut' }
            : {
                opacity: { duration: 0.3, ease: 'easeOut' },
                rotate: {
                  duration: rotationDurationS,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop' as const,
                },
              }
        }
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          style={{ display: 'block' }}
        >
          {isGradient && rayGradients != null && (
            <defs>
              {rayGradients.map((coords, i) => (
                <linearGradient
                  key={i}
                  id={`${gradientId}-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                >
                  {rayColor.stops
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map((stop, si) => (
                      <stop key={si} offset={`${stop.position}%`} stopColor={stop.color} />
                    ))}
                </linearGradient>
              ))}
            </defs>
          )}
          {wedgePaths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={isGradient ? `url(#${gradientId}-${i})` : (rayColor as string)}
            />
          ))}
        </svg>
      </m.div>

      {/* Content slot */}
      {children != null && (
        <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>{children}</div>
      )}
    </div>
  )
}

export const StandardEffectsStarburst = memo(StandardEffectsStarburstComponent)
