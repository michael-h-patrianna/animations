/**
 * Stagger-reveals child elements with a horizontal wipe-in effect.
 * Each child slides from off-screen left into view inside a clipped container.
 *
 * Copy-paste files: this file + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentListVerticalWipe stagger={100} duration={500}>
 *   <div>Step 1 complete</div>
 *   <div>Step 2 complete</div>
 * </ModalContentListVerticalWipe>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Children, memo } from 'react'

import { generateMockListItems } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 100
const DEFAULT_COUNT = 4

function ModalContentListVerticalWipeComponent({
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
      data-animation-id="modal-content__list-vertical-wipe"
      style={style}
    >
      {renderItems.map((child, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <m.div
            initial={prefersReducedMotion === true ? { opacity: 0 } : { x: '-100%', opacity: 0 }}
            animate={prefersReducedMotion === true ? { opacity: 1 } : { x: '0%', opacity: 1 }}
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
        </div>
      ))}
    </div>
  )
}

export const ModalContentListVerticalWipe = memo(ModalContentListVerticalWipeComponent)
