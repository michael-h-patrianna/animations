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
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import './IconAnimationsPulse.module.css'

interface IconAnimationsPulseProps {
  /** Image source URL. No default bundled — renders no image when omitted. */
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
  const prefersReducedMotion = useReducedMotion()

  return (
    <div data-animation-id="icon-animations__pulse">
      <m.div
        animate={
          prefersReducedMotion
            ? { scale: [1, 1.03, 1], opacity: [1, 0.85, 1] }
            : {
                scale: [1, 1.02, 1.05, 1.08, 1.12, 1.15, 1.12, 1.08, 1.05, 1.02, 1],
                rotate: [-2, -1.5, -1, 0, 1, 2, 1, 0, -0.5, -1.5, -2],
                skewY: [0, -0.5, -1, -1.5, -2, -2.5, -2, -1.5, -1, -0.5, 0],
                opacity: [1, 1, 0.98, 0.96, 0.94, 0.92, 0.94, 0.96, 0.98, 1, 1],
              }
        }
        transition={{
          duration: duration / 1000,
          ease: [0.4, 0, 0.6, 1] as const,
          repeat: Infinity,
        }}
      >
        {src !== undefined && (
          <img src={src} alt={alt} style={{ width, height: 'auto', display: 'block' }} />
        )}
      </m.div>
    </div>
  )
}

export const IconAnimationsPulse = memo(IconAnimationsPulseComponent)
