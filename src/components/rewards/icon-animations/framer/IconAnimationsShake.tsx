/**
 * Animated image — horizontal shake with rotation wobble and compression.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <IconAnimationsShake src="/bell.png" alt="notification" width={80} />
 */
import * as m from 'motion/react-m'
import { memo } from 'react'

interface IconAnimationsShakeProps {
  /** Image source URL. Renders a placeholder when omitted. */
  src?: string
  /** Alt text for the image. Default: '' */
  alt?: string
  /** Image width in px. Default: 120 */
  width?: number
  /** Animation duration in ms. Default: 500 */
  duration?: number
}

function IconAnimationsShakeComponent({
  src,
  alt = '',
  width = 120,
  duration = 500,
}: IconAnimationsShakeProps) {
  return (
    <div data-animation-id="icon-animations__shake">
      <m.div
        style={{ animation: 'none' }}
        animate={{
          x: [0, -10, 10, -8, 8, -6, 6, -4, 4, -2, 0],
          rotate: [0, -1, 1, -0.8, 0.8, -0.6, 0.6, -0.4, 0.4, -0.2, 0],
          scaleX: [1, 0.98, 0.98, 0.99, 0.99, 0.995, 0.995, 1, 1, 1, 1],
        }}
        transition={{
          duration: duration / 1000,
          ease: [0.4, 0, 0.6, 1] as const,
        }}
      >
        {src !== undefined ? (
          <img src={src} alt={alt} className="pf-icon-anim__image" style={{ width }} />
        ) : (
          <div className="pf-icon-anim__placeholder" style={{ width, height: width }} />
        )}
      </m.div>
    </div>
  )
}

export const IconAnimationsShake = memo(IconAnimationsShakeComponent)
