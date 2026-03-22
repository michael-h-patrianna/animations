/**
 * Stagger-reveals child elements with a scale-up spotlight effect.
 * Each child scales from 95% with slight overshoot and fades in.
 *
 * Copy-paste files: this file + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentListSpotlight stagger={120} duration={500}>
 *   <div>Milestone 1</div>
 *   <div>Milestone 2</div>
 * </ModalContentListSpotlight>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Children, memo } from 'react'

import { generateMockListItems } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 120
const DEFAULT_COUNT = 3

function ModalContentListSpotlightComponent({
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
      data-animation-id="modal-content__list-spotlight"
      style={style}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          initial={prefersReducedMotion === true ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
          animate={
            prefersReducedMotion === true
              ? { opacity: 1 }
              : { scale: [0.95, 1.02, 1], opacity: [0, 0.7, 1] }
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

export const ModalContentListSpotlight = memo(ModalContentListSpotlightComponent)
