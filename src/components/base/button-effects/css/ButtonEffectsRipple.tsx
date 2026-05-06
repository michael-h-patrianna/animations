/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Ripple — expanding light circle on click via CSS background-size transition.
 * Adds .pf-ripple to a DemoButton; a ::after pseudo-element handles the effect.
 *
 * Copy-paste files: this file + ButtonEffectsRipple.module.css
 * Runtime deps: react
 *
 * Usage:
 *   <ButtonEffectsRipple color="rgba(255,255,255,0.4)" />
 */

import { memo, type CSSProperties } from 'react'
import styles from './ButtonEffectsRipple.module.css'
import { DemoButton } from '@/components/demo-blocks'

interface ButtonEffectsRippleProps {
  /** Ripple circle color. Default: 'rgb(255 255 255 / 30%)' */
  color?: string
  /** Ripple expansion duration in ms. Default: 600 */
  duration?: number
}

function ButtonEffectsRippleComponent({ color, duration }: ButtonEffectsRippleProps) {
  const hasOverrides = color != null || duration != null
  const style = hasOverrides
    ? ({
        ...(color != null && { ['--pf-ripple-color' as string]: color }),
        ...(duration != null && { ['--pf-ripple-duration' as string]: `${duration}ms` }),
      } as CSSProperties)
    : undefined

  return (
    <DemoButton
      label="Click Me!"
      className={styles['pf-ripple']}
      data-animation-id="button-effects__ripple"
      style={style}
    />
  )
}

export const ButtonEffectsRipple = memo(ButtonEffectsRippleComponent)
