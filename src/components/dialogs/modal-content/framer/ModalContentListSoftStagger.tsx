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

import {
  DemoButton,
  DemoList,
  DemoModalBody,
  DemoModalFooter,
  DemoModalHeader,
} from '@/components/demo-blocks'
import { generateMockListItems } from '@/components/dialogs/modal-content/MockContentItems'
import {
  MODAL_ENTRANCE,
  REDUCED_FADE,
  buttonBounceProps,
  toItemArray,
  type ContentStaggerProps,
} from '@/components/dialogs/modal-content/SharedTypes'

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
  const items = toItemArray(children)
  const durationS = duration / 1000
  const staggerS = stagger / 1000
  const reduced = prefersReducedMotion === true

  const animateListItem = (child: React.ReactNode, i: number, delayBase: number) => (
    <m.div
      key={i}
      initial={reduced ? { opacity: 0 } : { y: 12, opacity: 0 }}
      animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
      transition={
        reduced
          ? { duration: 0.01 }
          : {
              duration: durationS,
              delay: delayBase + staggerS * i,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }
      }
      style={{ animation: 'none' }}
    >
      {child}
    </m.div>
  )

  if (items.length > 0) {
    return (
      <div
        className={
          className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'
        }
        data-animation-id="modal-content__list-soft-stagger"
        style={style}
      >
        {items.map((child, i) => animateListItem(child, i, 0))}
      </div>
    )
  }

  const mockItems = generateMockListItems(DEFAULT_COUNT)

  return (
    <div className="pf-demo-overlay" data-animation-id="modal-content__list-soft-stagger">
      <m.div
        className="pf-demo-modal"
        {...(reduced ? REDUCED_FADE : MODAL_ENTRANCE)}
        style={{ animation: 'none' }}
      >
        <DemoModalHeader title="Recent Changes" />
        <DemoModalBody>
          <DemoList>{mockItems.map((item, i) => animateListItem(item, i, 0.3))}</DemoList>
        </DemoModalBody>
        <DemoModalFooter>
          <m.div
            {...buttonBounceProps(0.6, reduced)}
            onAnimationComplete={onAnimationComplete}
            style={{ animation: 'none' }}
          >
            <DemoButton label="Got it" />
          </m.div>
        </DemoModalFooter>
      </m.div>
    </div>
  )
}

export const ModalContentListSoftStagger = memo(ModalContentListSoftStaggerComponent)
