/**
 * Animated image — gentle floating with sway and subtle scale breathing.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <IconAnimationsFloat src="/balloon.png" alt="balloon" duration={8000} />
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import './IconAnimationsFloat.module.css'

interface IconAnimationsFloatProps {
  /** Image source URL. Default: bundled diamond icon. */
  src?: string
  /** Alt text for the image. Default: '' */
  alt?: string
  /** Image width in px. Default: 120 */
  width?: number
  /** Duration of one full cycle in ms. Default: 6000 */
  duration?: number
}

function IconAnimationsFloatComponent({
  src,
  alt = '',
  width = 120,
  duration = 6000,
}: IconAnimationsFloatProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div data-animation-id="icon-animations__float">
      <m.div
        style={{ transformOrigin: 'center 20%' }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [
                  0, -1.5, -3, -4.5, -6, -7.5, -9, -10.5, -12, -13, -14, -13, -12, -10.5, -9, -7.5,
                  -6, -4.5, -3, -1.5, 0,
                ],
                x: [0, 1, 2, 3, 4, 5, 5.5, 5, 4, 2.5, 0, -2.5, -4, -5, -5.5, -5, -4, -3, -2, -1, 0],
                rotate: [
                  0, -1.5, -2.5, -3, -3.5, -4, -3.5, -2.5, -1.5, -0.5, 0, 0.5, 1.5, 2.5, 3.5, 4,
                  3.5, 3, 2.5, 1.5, 0,
                ],
                scale: [
                  1, 1.002, 1.004, 1.006, 1.008, 1.01, 1.012, 1.014, 1.016, 1.018, 1.02, 1.018,
                  1.016, 1.014, 1.012, 1.01, 1.008, 1.006, 1.004, 1.002, 1,
                ],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: duration / 1000,
                ease: [0.4, 0, 0.6, 1] as const,
                repeat: Infinity,
              }
        }
      >
        <img src={src} alt={alt} style={{ width, height: 'auto', display: 'block' }} />
      </m.div>
    </div>
  )
}

export const IconAnimationsFloat = memo(IconAnimationsFloatComponent)
