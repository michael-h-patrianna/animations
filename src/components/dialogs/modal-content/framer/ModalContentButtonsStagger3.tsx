/**
 * Stagger-reveals child elements with a bounce-up pop effect (3-button default).
 * Same choreography as ButtonsStagger2 but defaults to 3 placeholder items.
 *
 * Copy-paste files: this file + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentButtonsStagger3 stagger={70} duration={320}>
 *   <button>Accept</button>
 *   <button>Later</button>
 *   <button>Skip</button>
 * </ModalContentButtonsStagger3>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Children, memo } from 'react'

import { generateMockButtons } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

const DEFAULT_DURATION = 320
const DEFAULT_STAGGER = 70
const DEFAULT_COUNT = 3

function ModalContentButtonsStagger3Component({
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
      data-animation-id="modal-content__buttons-stagger-3"
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

export const ModalContentButtonsStagger3 = memo(ModalContentButtonsStagger3Component)
