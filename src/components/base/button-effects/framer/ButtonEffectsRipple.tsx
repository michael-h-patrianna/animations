/**
 * Ripple — expanding light circle on click via background-size transition.
 * An overlay span uses the background-size technique; transitions are applied
 * via inline style (framer variants must not use CSS transitions).
 *
 * Copy-paste files: this file + ButtonEffectsRipple.module.css
 * Runtime deps: react, motion
 *
 * Usage:
 *   <ButtonEffectsRipple color="rgba(255,255,255,0.4)" />
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useRef } from 'react'
import styles from './ButtonEffectsRipple.module.css'
import { DemoButton } from '@/components/demo-blocks'

interface ButtonEffectsRippleProps {
  /** Ripple circle color. Default: 'rgb(255 255 255 / 30%)' */
  color?: string
  /** Ripple expansion duration in ms. Default: 600 */
  duration?: number
}

function ButtonEffectsRippleComponent({ color, duration = 600 }: ButtonEffectsRippleProps) {
  const prefersReducedMotion = useReducedMotion()
  const overlayRef = useRef<HTMLSpanElement>(null)
  const dur = prefersReducedMotion ? '0.15s' : `${duration}ms`
  const animated = `background-size ${dur} ease-out, opacity 0.3s ease-out 0.4s`

  const setInstant = () => {
    if (overlayRef.current) overlayRef.current.style.transition = 'background-size 0s, opacity 0s'
  }
  const setAnimated = () => {
    if (overlayRef.current) overlayRef.current.style.transition = animated
  }

  return (
    <m.div
      className={styles['pf-ripple-fm']}
      data-animation-id="button-effects__ripple"
      onPointerDown={setInstant}
      onPointerUp={setAnimated}
      onPointerLeave={setAnimated}
      style={{
        ...(color != null && { ['--pf-ripple-color' as string]: color }),
      }}
    >
      <DemoButton label="Click Me!" />
      <span
        ref={overlayRef}
        className={styles['pf-ripple-fm__overlay']}
        aria-hidden
        style={{ transition: animated }}
      />
    </m.div>
  )
}

export const ButtonEffectsRipple = memo(ButtonEffectsRippleComponent)
