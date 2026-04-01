/**
 * Starburst / Radial Rays — glowing radial ray background that wraps content.
 * A soft center glow breathes while geometric light rays rotate continuously.
 * Port to React Native: SVG wedges via react-native-svg in a static container,
 * rotation via Reanimated withTiming on a wrapper MotiView. Glow via
 * animated opacity on a colored View.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsStarburst rayCount={12} size={200}><YourIcon /></StandardEffectsStarburst>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo, type ReactNode } from 'react'
import {
  STARBURST_RAY_COLOR,
  STARBURST_GLOW_COLOR,
} from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsStarburstProps {
  /** Color of the ray wedges. */
  rayColor?: string
  /** Center glow color. */
  glowColor?: string
  /** Number of ray wedges (even numbers work best). Default: 12 */
  rayCount?: number
  /** Time for one full revolution in ms. Default: 10000 */
  rotationSpeed?: number
  /** Diameter of the ray disc in px. Default: 200 */
  size?: number
  /** Content rendered on top of rays. */
  children?: ReactNode
}

function buildWedgePath(index: number, total: number, radius: number): string {
  const sliceAngle = (2 * Math.PI) / total
  const startAngle = index * sliceAngle
  const endAngle = startAngle + sliceAngle / 2
  const cx = radius
  const cy = radius
  const x1 = cx + radius * Math.cos(startAngle)
  const y1 = cy + radius * Math.sin(startAngle)
  const x2 = cx + radius * Math.cos(endAngle)
  const y2 = cy + radius * Math.sin(endAngle)
  return `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`
}

function StandardEffectsStarburstComponent({
  rayColor = STARBURST_RAY_COLOR,
  glowColor = STARBURST_GLOW_COLOR,
  rayCount = 12,
  rotationSpeed = 10000,
  size = 200,
  children,
}: StandardEffectsStarburstProps) {
  const prefersReducedMotion = useReducedMotion()
  const radius = size / 2
  const rotationDurationS = rotationSpeed / 1000

  const wedgePaths = useMemo(() => {
    const clampedCount = Math.max(4, Math.min(24, rayCount))
    return Array.from({ length: clampedCount }, (_, i) => buildWedgePath(i, clampedCount, radius))
  }, [rayCount, radius])

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
      {/* Layer 1: Rotating ray disc — static SVG inside a Motion-rotated wrapper */}
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
          {wedgePaths.map((d, i) => (
            <path key={i} d={d} fill={rayColor} />
          ))}
        </svg>
      </m.div>

      {/* Layer 2: Center glow — static blur in style, animated opacity */}
      <m.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: radius * 0.6,
          height: radius * 0.6,
          marginLeft: -(radius * 0.3),
          marginTop: -(radius * 0.3),
          borderRadius: '50%',
          background: glowColor,
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 0.5 } : { opacity: [0.4, 0.7, 0.4] }}
        transition={
          prefersReducedMotion
            ? { duration: 0.3, ease: 'easeOut' }
            : {
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop' as const,
              }
        }
      />

      {/* Layer 3: Content slot */}
      {children != null && (
        <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>{children}</div>
      )}
    </div>
  )
}

export const StandardEffectsStarburst = memo(StandardEffectsStarburstComponent)
