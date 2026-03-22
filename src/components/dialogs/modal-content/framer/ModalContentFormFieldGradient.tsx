/**
 * Stagger-reveals child elements with a gradient sweep highlight.
 * Each child slides up and briefly pulses with a blue gradient before settling.
 *
 * Copy-paste files: this file + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentFormFieldGradient stagger={120} duration={500}>
 *   <div><label>Name</label><input /></div>
 *   <div><label>Email</label><input /></div>
 * </ModalContentFormFieldGradient>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Children, memo } from 'react'

import { generateMockFormFields } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 120
const DEFAULT_COUNT = 3

function ModalContentFormFieldGradientComponent({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
  onAnimationComplete,
}: ContentStaggerProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockFormFields(DEFAULT_COUNT)

  const durationS = duration / 1000
  const staggerS = stagger / 1000

  return (
    <div
      className={className !== undefined ? `pf-content-stagger pf-content-stagger--form ${className}` : 'pf-content-stagger pf-content-stagger--form'}
      data-animation-id="modal-content__form-field-gradient"
      style={style}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          initial={prefersReducedMotion === true ? { opacity: 0 } : { y: 20, opacity: 0 }}
          animate={
            prefersReducedMotion === true
              ? { opacity: 1 }
              : {
                  y: [20, 0, 0],
                  opacity: [0, 1, 1],
                  background: [
                    'linear-gradient(90deg, transparent 0%, var(--pf-gradient-sweep-10) 50%, transparent 100%)',
                    'linear-gradient(90deg, transparent 0%, var(--pf-gradient-sweep-20) 50%, transparent 100%)',
                    'transparent',
                  ],
                }
          }
          transition={
            prefersReducedMotion === true
              ? { duration: 0.01 }
              : { duration: durationS, delay: staggerS * i, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.5, 1] }
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

export const ModalContentFormFieldGradient = memo(ModalContentFormFieldGradientComponent)
