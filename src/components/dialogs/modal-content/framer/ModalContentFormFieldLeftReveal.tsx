/**
 * Stagger-reveals child elements by sliding in from the left.
 * Each child translates horizontally from -distance to 0.
 *
 * Copy-paste files: this file + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentFormFieldLeftReveal stagger={90} distance={40}>
 *   <div><label>Name</label><input /></div>
 *   <div><label>Email</label><input /></div>
 * </ModalContentFormFieldLeftReveal>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Children, memo } from 'react'

import { generateMockFormFields } from '../MockContentItems'
import type { DirectionalRevealProps } from '../SharedTypes'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 90
const DEFAULT_DISTANCE = 32
const DEFAULT_COUNT = 3

function ModalContentFormFieldLeftRevealComponent({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  distance = DEFAULT_DISTANCE,
  className,
  style,
  onAnimationComplete,
}: DirectionalRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockFormFields(DEFAULT_COUNT)

  const durationS = duration / 1000
  const staggerS = stagger / 1000

  return (
    <div
      className={className !== undefined ? `pf-content-stagger pf-content-stagger--form ${className}` : 'pf-content-stagger pf-content-stagger--form'}
      data-animation-id="modal-content__form-field-left-reveal"
      style={style}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          initial={prefersReducedMotion === true ? { opacity: 0 } : { x: -distance, opacity: 0 }}
          animate={prefersReducedMotion === true ? { opacity: 1 } : { x: 0, opacity: 1 }}
          transition={
            prefersReducedMotion === true
              ? { duration: 0.01 }
              : { duration: durationS, delay: staggerS * i, ease: [0.4, 0, 0.2, 1] as const }
          }
          onAnimationComplete={i === renderItems.length - 1 ? onAnimationComplete : undefined}
          style={{ animation: 'none' }}
        >
          {child}
        </m.div>
      ))}
    </div>
  )
}

export const ModalContentFormFieldLeftReveal = memo(ModalContentFormFieldLeftRevealComponent)
