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
import { isLinearGradient, toSvgGradientCoords, type ColorOrGradient } from '@/types/gradient'

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
  const fillValue = isGradient ? `url(#${gradientId})` : (rayColor as string)

  const gradientCoords = useMemo(() => {
    if (!isGradient) return null
    return toSvgGradientCoords(rayColor.angle, size)
  }, [isGradient, rayColor, size])

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
          {isGradient && gradientCoords != null && (
            <defs>
              <linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1={gradientCoords.x1}
                y1={gradientCoords.y1}
                x2={gradientCoords.x2}
                y2={gradientCoords.y2}
              >
                {rayColor.stops
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map((stop, i) => (
                    <stop key={i} offset={`${stop.position}%`} stopColor={stop.color} />
                  ))}
              </linearGradient>
            </defs>
          )}
          {wedgePaths.map((d, i) => (
            <path key={i} d={d} fill={fillValue} />
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
