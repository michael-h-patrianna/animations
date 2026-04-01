/**
 * Starburst / Radial Rays — CSS variant.
 * Rotating ray wedges with breathing center glow, wraps content.
 *
 * Copy-paste files: this file + StandardEffectsStarburst.module.css
 * Runtime deps: react
 *
 * Usage: <StandardEffectsStarburst rayCount={12} size={200}><YourIcon /></StandardEffectsStarburst>
 */
import { memo, useMemo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsStarburst.module.css'
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
  const radius = size / 2

  const wedgePaths = useMemo(() => {
    const clampedCount = Math.max(4, Math.min(24, rayCount))
    return Array.from({ length: clampedCount }, (_, i) => buildWedgePath(i, clampedCount, radius))
  }, [rayCount, radius])

  const cssVars = {
    ['--pf-starburst-ray-color' as string]: rayColor,
    ['--pf-starburst-glow-color' as string]: glowColor,
    ['--pf-starburst-size' as string]: `${size}px`,
    ['--pf-starburst-rotation-speed' as string]: `${rotationSpeed}ms`,
  } as CSSProperties

  return (
    <div
      className={styles['pf-starburst']}
      data-animation-id="standard-effects__starburst"
      style={cssVars}
      role="img"
      aria-label="Starburst radial rays"
    >
      {/* Layer 1: Rotating ray disc */}
      <div className={styles['pf-starburst__rays']} aria-hidden="true">
        <svg viewBox={`0 0 ${size} ${size}`}>
          {wedgePaths.map((d, i) => (
            <path key={i} d={d} fill={rayColor} />
          ))}
        </svg>
      </div>

      {/* Layer 2: Center glow */}
      <div className={styles['pf-starburst__glow']} aria-hidden="true" />

      {/* Layer 3: Content slot */}
      {children != null && <div className={styles['pf-starburst__content']}>{children}</div>}
    </div>
  )
}

export const StandardEffectsStarburst = memo(StandardEffectsStarburstComponent)
