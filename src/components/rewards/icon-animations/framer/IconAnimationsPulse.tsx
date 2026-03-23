/**
 * Animated image — scale pulse with rotation wobble and opacity breathing.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <IconAnimationsPulse src="/scroll.png" alt="scroll" width={100} />
 */
import * as m from 'motion/react-m'
import { memo } from 'react'

interface IconAnimationsPulseProps {
  /** Image source URL. Renders a placeholder when omitted. */
  src?: string
  /** Alt text for the image. Default: '' */
  alt?: string
  /** Image width in px. Default: 140 */
  width?: number
  /** Duration of one full cycle in ms. Default: 2000 */
  duration?: number
}

function IconAnimationsPulseComponent({
  src,
  alt = '',
  width = 140,
  duration = 2000,
}: IconAnimationsPulseProps) {
  return (
    <div data-animation-id="icon-animations__pulse">
      <m.div
        style={{ animation: 'none' }}
        animate={{
          scale: [1, 1.02, 1.05, 1.08, 1.12, 1.15, 1.12, 1.08, 1.05, 1.02, 1],
          rotate: [-2, -1.5, -1, 0, 1, 2, 1, 0, -0.5, -1.5, -2],
          skewY: [0, -0.5, -1, -1.5, -2, -2.5, -2, -1.5, -1, -0.5, 0],
          opacity: [1, 1, 0.98, 0.96, 0.94, 0.92, 0.94, 0.96, 0.98, 1, 1],
        }}
        transition={{
          duration: duration / 1000,
          ease: [0.4, 0, 0.6, 1] as const,
          repeat: Infinity,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
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

export const IconAnimationsPulse = memo(IconAnimationsPulseComponent)
