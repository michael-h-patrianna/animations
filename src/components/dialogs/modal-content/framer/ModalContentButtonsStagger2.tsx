/**
 * Stagger-reveals child elements with a bounce-up pop effect.
 * Designed for button groups — each child pops in with overshoot settle.
 *
 * Copy-paste files: this file + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentButtonsStagger2 stagger={70} duration={300}>
 *   <button>Accept</button>
 *   <button>Cancel</button>
 * </ModalContentButtonsStagger2>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Children, memo } from 'react'

import { generateMockButtons } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

const DEFAULT_DURATION = 300
const DEFAULT_STAGGER = 70
const DEFAULT_COUNT = 2

function ModalContentButtonsStagger2Component({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
  onAnimationComplete,
}: ContentStaggerProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockButtons(DEFAULT_COUNT)

  const durationS = duration / 1000
  const staggerS = stagger / 1000

  return (
    <div
      className={className !== undefined ? `pf-content-stagger pf-content-stagger--horizontal ${className}` : 'pf-content-stagger pf-content-stagger--horizontal'}
      data-animation-id="modal-content__buttons-stagger-2"
      style={style}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          initial={prefersReducedMotion === true ? { opacity: 0 } : { y: 16, scale: 0.94, opacity: 0 }}
          animate={
            prefersReducedMotion === true
              ? { opacity: 1 }
              : { y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }
          }
          transition={
            prefersReducedMotion === true
              ? { duration: 0.01 }
              : { duration: durationS, delay: staggerS * i, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.6, 1] }
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

export const ModalContentButtonsStagger2 = memo(ModalContentButtonsStagger2Component)
