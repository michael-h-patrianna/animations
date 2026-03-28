/**
 * Ripple — expanding light circle on click via background-size transition.
 * An overlay span uses the background-size technique; transitions are applied
 * via inline style (framer variants must not use CSS transitions).
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage:
 *   <ButtonEffectsRipple color="rgba(255,255,255,0.4)" />
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useRef } from 'react'
import { DemoButton } from '@/components/demo-blocks'

/** @internal Default kept as token reference — consumer overrides via `color` prop. */
const DEFAULT_RIPPLE_COLOR = 'var(--pf-ripple-color, rgb(255 255 255 / 30%))'

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

  const rippleColor = color ?? DEFAULT_RIPPLE_COLOR

  const setInstant = () => {
    const el = overlayRef.current
    if (!el) return
    el.style.transition = 'background-size 0s, opacity 0s'
    el.style.opacity = '1'
    el.style.backgroundSize = '100%'
  }
  const setAnimated = () => {
    const el = overlayRef.current
    if (!el) return
    el.style.transition = animated
    el.style.opacity = '0'
    el.style.backgroundSize = '1000%'
  }

  return (
    <m.div
      data-animation-id="button-effects__ripple"
      onPointerDown={setInstant}
      onPointerUp={setAnimated}
      onPointerLeave={setAnimated}
      style={{
        position: 'relative',
        display: 'inline-flex',
        overflow: 'hidden',
        borderRadius: 50,
      }}
    >
      <DemoButton label="Click Me!" />
      <span
        ref={overlayRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          zIndex: 1,
          opacity: 0,
          background: `radial-gradient(circle, ${rippleColor} 10%, transparent 10.5%) center / 1000%`,
          transition: animated,
        }}
      />
    </m.div>
  )
}

export const ButtonEffectsRipple = memo(ButtonEffectsRippleComponent)
