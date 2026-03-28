/**
 * Attention arrow — looping squish + nudge pointing at a center element.
 * Common mobile-game "tap here!" pattern. Position the arrow on any side.
 * Absolutely positioned — does not affect the target element's layout.
 *
 * Copy-paste files: this file + IconAnimationsTapArrow.css
 * Runtime deps: react, motion
 *
 * Usage: <IconAnimationsTapArrow position="left"><YourButton /></IconAnimationsTapArrow>
 */
import * as m from 'motion/react-m'
import { memo, type CSSProperties, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'
import styles from './IconAnimationsTapArrow.module.css'

type ArrowPosition = 'left' | 'right' | 'top' | 'bottom'

interface IconAnimationsTapArrowProps {
  /** Element the arrow points at. Default: DemoBox with "Tap me" label. */
  children?: ReactNode
  /** Which side the arrow appears on. Default: 'left' */
  position?: ArrowPosition
  /** Custom arrow image URL. When provided, renders as <img> and fill/stroke props are ignored. */
  arrowSrc?: string
  /** SVG fill color (default embedded arrow only). */
  fill?: string
  /** SVG stroke color (default embedded arrow only). Default: 'none' */
  stroke?: string
  /** SVG stroke width (default embedded arrow only). Default: 0 */
  strokeWidth?: number
  /** Animation cycle duration in ms. Default: 1200 */
  duration?: number
  /** How far the arrow nudges toward the target in px. Default: 12 */
  nudgeDistance?: number
  /** Arrow width in px. Default: 48 */
  arrowSize?: number
}

const ROTATION: Record<ArrowPosition, number> = {
  left: 0,
  right: 180,
  top: 90,
  bottom: -90,
}

const GAP_PX = 6
const ANCHOR_STYLE: Record<ArrowPosition, CSSProperties> = {
  left: { right: '100%', marginRight: GAP_PX, top: '50%', transform: 'translateY(-50%)' },
  right: { left: '100%', marginLeft: GAP_PX, top: '50%', transform: 'translateY(-50%)' },
  top: { bottom: '100%', marginBottom: GAP_PX, left: '50%', transform: 'translateX(-50%)' },
  bottom: { top: '100%', marginTop: GAP_PX, left: '50%', transform: 'translateX(-50%)' },
}

function DefaultArrow({
  fill,
  stroke,
  strokeWidth,
  size,
}: {
  fill: string
  stroke: string
  strokeWidth: number
  size: number
}) {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 64 48"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path
        d="M32.627,0c3.609,0 21.38,5.938 30.498,22.099c0.601,1.065 0.636,2.42 0.062,3.505c-7.694,14.703 -26.966,22.051 -30.56,22.051c-2.814,0 -5.226,-6.049 -6.249,-14.647c-9.574,3.124 -20.689,5.115 -22.03,5.115c-2.399,-0 -4.348,-6.402 -4.348,-14.295c0,-7.894 1.949,-14.295 4.348,-14.295c1.341,-0 12.456,1.99 22.03,5.122c1.023,-8.606 3.435,-14.655 6.249,-14.655Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

function IconAnimationsTapArrowComponent({
  children,
  position = 'left',
  arrowSrc,
  fill,
  stroke = 'none',
  strokeWidth = 0,
  duration = 1200,
  nudgeDistance = 12,
  arrowSize = 48,
}: IconAnimationsTapArrowProps) {
  const sec = duration / 1000
  const resolvedFill = fill ?? 'var(--pf-brand-accent-primary, #c83558)'

  return (
    <div data-animation-id="icon-animations__tap-arrow" className={styles['pf-tap-arrow-fm']}>
      <div className={styles['pf-tap-arrow-fm__target']}>
        {children ?? <DemoBox label="Tap me" />}
        <div className={styles['pf-tap-arrow-fm__anchor']} style={ANCHOR_STYLE[position]}>
          <div
            className={styles['pf-tap-arrow-fm__rotator']}
            style={{ transform: `rotate(${ROTATION[position]}deg)` }}
          >
            <m.div
              className={styles['pf-tap-arrow-fm__animator']}
              style={{ transformOrigin: 'left center' }}
              animate={{
                x: [0, nudgeDistance * 0.5, nudgeDistance, nudgeDistance * 0.5, 0],
                scaleX: [1, 0.88, 1.12, 0.94, 1],
                scaleY: [1, 1.06, 0.94, 1.03, 1],
              }}
              transition={{
                duration: sec,
                ease: [0.4, 0, 0.6, 1] as const,
                repeat: Infinity,
                repeatType: 'loop' as const,
              }}
            >
              {arrowSrc !== undefined ? (
                <img
                  src={arrowSrc}
                  alt=""
                  className={styles['pf-tap-arrow-fm__image']}
                  style={{ width: arrowSize }}
                />
              ) : (
                <DefaultArrow
                  fill={resolvedFill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  size={arrowSize}
                />
              )}
            </m.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const IconAnimationsTapArrow = memo(IconAnimationsTapArrowComponent)
