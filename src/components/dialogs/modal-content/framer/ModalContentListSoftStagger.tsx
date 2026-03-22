/**
 * Modal with soft-stagger list reveal.
 * Modal scales in, list items fade up one by one, then button pops in.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
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
import { memo } from 'react'

import { generateMockListItems, MockButton, MockModalHeader } from '../MockContentItems'
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
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const durationS = duration / 1000
  const staggerS = stagger / 1000
  const reduced = prefersReducedMotion === true

  const animateListItem = (child: React.ReactNode, i: number, delayBase: number) => (
    <m.div
      key={i}
      initial={reduced ? { opacity: 0 } : { y: 12, opacity: 0 }}
      animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
      transition={reduced ? { duration: 0.01 } : { duration: durationS, delay: delayBase + staggerS * i, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      style={{ animation: 'none' }}
    >
      {child}
    </m.div>
  )

  if (items.length > 0) {
    return (
      <div
        className={className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'}
        data-animation-id="modal-content__list-soft-stagger"
        style={style}
      >
        {items.map((child, i) => animateListItem(child, i, 0))}
      </div>
    )
  }

  const mockItems = generateMockListItems(DEFAULT_COUNT)

  return (
    <div className="pf-mc-overlay" data-animation-id="modal-content__list-soft-stagger">
      <m.div
        className="pf-mc-box"
        initial={reduced ? { opacity: 0 } : { scale: 0.88, y: -16, opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { scale: [0.88, 1.02, 1], y: [-16, -4, 0], opacity: [0, 0.6, 1] }}
        transition={reduced ? { duration: 0.01 } : { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.5, 1] }}
        style={{ animation: 'none' }}
      >
        <MockModalHeader title="Recent Changes" />
        <div className="pf-mc-body">
          <div className="pf-mc-list">
            {mockItems.map((item, i) => animateListItem(item, i, 0.3))}
          </div>
        </div>
        <div className="pf-mc-footer">
          <m.div
            initial={reduced ? { opacity: 0 } : { y: 16, scale: 0.94, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }}
            transition={reduced ? { duration: 0.01 } : { duration: 0.3, delay: 0.6, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.6, 1] }}
            onAnimationComplete={onAnimationComplete}
            style={{ animation: 'none' }}
          >
            <MockButton label="Got it" />
          </m.div>
        </div>
      </m.div>
    </div>
  )
}

export const ModalContentListSoftStagger = memo(ModalContentListSoftStaggerComponent)
