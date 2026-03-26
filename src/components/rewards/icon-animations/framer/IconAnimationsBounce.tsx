/**
 * Animated image — bounce with squash-stretch deformation and tilt.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <IconAnimationsBounce src="/icon.png" alt="reward" width={80} />
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

interface IconAnimationsBounceProps {
  /** Image source URL. Renders a placeholder when omitted. */
  src?: string
  /** Alt text for the image. Default: '' */
  alt?: string
  /** Image width in px. Default: 120 */
  width?: number
  /** Animation duration in ms. Default: 800 */
  duration?: number
}

function IconAnimationsBounceComponent({
  src,
  alt = '',
  width = 120,
  duration = 800,
}: IconAnimationsBounceProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div data-animation-id="icon-animations__bounce">
      <m.div
        style={{ transformOrigin: 'center bottom', animation: 'none' }}
        animate={
          prefersReducedMotion
            ? { scaleY: [1, 0.97, 1.03, 1], scaleX: [1, 1.02, 0.99, 1] }
            : {
                y: [0, 0, -30, -40, -30, 0, 0, 0],
                scaleY: [1, 0.8, 1.1, 1, 0.95, 0.9, 0.95, 1],
                scaleX: [1, 1.1, 0.9, 1, 1.02, 1.05, 1.02, 1],
                rotate: [0, 0, -2, -1, 1, 0, 0, 0],
              }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.4, ease: 'easeInOut' }
            : {
                duration: duration / 1000,
                ease: [0.4, 0, 0.6, 1] as const,
                times: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 0.9, 1],
              }
        }
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

export const IconAnimationsBounce = memo(IconAnimationsBounceComponent)
