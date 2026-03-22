/**
 * Stagger-reveals child elements with a soft upward fade.
 * Each child slides up slightly and fades in with gentle easing.
 *
 * Copy-paste files: this file + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentListSoftStagger stagger={60} duration={400}>
 *   <div>Item one</div>
 *   <div>Item two</div>
 * </ModalContentListSoftStagger>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Children, memo } from 'react'

import { generateMockListItems } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

const DEFAULT_DURATION = 400
const DEFAULT_STAGGER = 60
const DEFAULT_COUNT = 5

function ModalContentListSoftStaggerComponent({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
  onAnimationComplete,
}: ContentStaggerProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockListItems(DEFAULT_COUNT)

  const durationS = duration / 1000
  const staggerS = stagger / 1000

  return (
    <div
      className={className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'}
      data-animation-id="modal-content__list-soft-stagger"
      style={style}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          initial={prefersReducedMotion === true ? { opacity: 0 } : { y: 12, opacity: 0 }}
          animate={prefersReducedMotion === true ? { opacity: 1 } : { y: 0, opacity: 1 }}
          transition={
            prefersReducedMotion === true
              ? { duration: 0.01 }
              : { duration: durationS, delay: staggerS * i, ease: [0.25, 0.46, 0.45, 0.94] as const }
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

export const ModalContentListSoftStagger = memo(ModalContentListSoftStaggerComponent)
